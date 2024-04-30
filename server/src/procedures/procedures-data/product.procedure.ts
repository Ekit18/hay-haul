export const DELETE_PRODUCT_TYPE_PROCEDURE_NAME = 'delete_product_type_procedure'
export const deleteProductTypeProcedure = `
create or alter procedure ${DELETE_PRODUCT_TYPE_PROCEDURE_NAME} @productTypeId varchar(255) as
begin
    DECLARE @productId varchar(255);
    DECLARE db_cursor CURSOR FOR 
        SELECT id FROM product WHERE productTypeId = @productTypeId

    OPEN db_cursor

    FETCH NEXT FROM db_cursor INTO @productId

    WHILE @@FETCH_STATUS = 0
    BEGIN  
        IF @productId is not NULL
        BEGIN
            CLOSE db_cursor  
            DEALLOCATE db_cursor 
            RAISERROR('Product type with products is prohibited to delete', 12, 1);
            RETURN;
        END

        FETCH NEXT FROM db_cursor INTO @productId 
    END 

    CLOSE db_cursor  
    DEALLOCATE db_cursor 

    delete from product_type where id=@productTypeId
end
`;

export const UPDATE_PRODUCT_PROCEDURE_NAME = 'update_product_procedure'
export const updateProductTypeProcedure = `
CREATE OR ALTER PROCEDURE ${UPDATE_PRODUCT_PROCEDURE_NAME}
@id UNIQUEIDENTIFIER,
@name NVARCHAR(255) = NULL,
@quantity INT = NULL,
@userId UNIQUEIDENTIFIER
AS
BEGIN
    DECLARE @facilityUserId UNIQUEIDENTIFIER, @auctionStatus NVARCHAR(255)

    SELECT @facilityUserId = facility_details.userId, @auctionStatus = product_auction.auctionStatus
    FROM product
    INNER JOIN facility_details ON product.facilityDetailsId = facility_details.id
    LEFT JOIN product_auction ON product.id = product_auction.productId
    WHERE product.id = @id

    IF @facilityUserId != @userId
    BEGIN
     RAISERROR('Unauthorized to update product', 12, 1);
        RETURN
    END
    
        IF @auctionStatus NOT IN ('Inactive', 'StartSoon')
        BEGIN
        RAISERROR('Product in use cannot be updated', 12, 1);
            RETURN
        END
    
        UPDATE product
        SET 
            name = ISNULL(@name, name),
            quantity = ISNULL(@quantity, quantity)
        WHERE id = @id
    END
`;

export const DELETE_PRODUCT_PROCEDURE_NAME = 'delete_product_procedure'
export const deleteProductProcedure = `
CREATE OR ALTER PROCEDURE ${DELETE_PRODUCT_PROCEDURE_NAME}(
@id UNIQUEIDENTIFIER,
@userId UNIQUEIDENTIFIER)
as
begin
    DECLARE @facilityUserId UNIQUEIDENTIFIER, @auctionStatus NVARCHAR(255)

    SELECT @facilityUserId = facility_details.userId, @auctionStatus = product_auction.auctionStatus
    FROM product
    INNER JOIN facility_details ON product.facilityDetailsId = facility_details.id
    LEFT JOIN product_auction ON product.id = product_auction.productId
    WHERE product.id = @id

    IF @facilityUserId != @userId
    BEGIN
        RAISERROR('Unauthorized to delete product', 12, 1);
        RETURN
    END

    IF @auctionStatus NOT IN ('Inactive', 'StartSoon')
    BEGIN
        RAISERROR('Product in use cannot be deleted', 12, 1);
        RETURN
    END

    DELETE FROM product WHERE id = @id
end
`;

export const CREATE_PRODUCT_PROCEDURE_NAME = 'create_product'
export const createProductProcedure = `
CREATE OR ALTER PROCEDURE ${CREATE_PRODUCT_PROCEDURE_NAME}(
@name varchar(255),
@quantity int,
@facilityId uniqueidentifier,
@productTypeId uniqueidentifier
)
AS
BEGIN
	IF(NOT EXISTS (SELECT * FROM [facility_details] WHERE id=@facilityId))
	BEGIN
		RAISERROR('Facility details not found',12,1)
		RETURN
	END
		IF(NOT EXISTS (SELECT * FROM [product_type] WHERE id=@productTypeId))
	BEGIN
		RAISERROR('Product type not found',12,1)
		RETURN
	END
	INSERT INTO [product] (name,quantity,facilityDetailsId,productTypeId) VALUES (@name,@quantity,@facilityId,@productTypeId)
END
`