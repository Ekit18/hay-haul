export const DELETE_PRODUCT_TYPE_TRIGGER_NAME = 'delete_product_type_trigger'
export const deleteProductTypeTrigger = `
create or alter trigger ${DELETE_PRODUCT_TYPE_TRIGGER_NAME}
ON product_type
after delete
as
BEGIN
    DECLARE @productTypeId varchar(255);
    SELECT @productTypeId = id FROM deleted;

	DECLARE db_cursor CURSOR FOR 
		SELECT id FROM product WHERE productTypeId = @productTypeId

	DECLARE @productId varchar(255);

	OPEN db_cursor

	FETCH NEXT FROM db_cursor INTO @productId

	WHILE @@FETCH_STATUS = 0
	BEGIN  
		IF @productId != NULL
		BEGIN
			RAISERROR('Product type with products is prohibited to delete', 12, 1);
			RETURN;
		END

 		FETCH NEXT FROM db_cursor INTO @productId 
	END 

	CLOSE db_cursor  

	DEALLOCATE db_cursor 
	  
END
`;

// create or alter procedure delete_product_type_procedure @productTypeId varchar(255) as
// begin
// print @productTypeId
// begin transaction test
//     begin try
//         if exists (select * from product where productTypeId = @productTypeId)
//         begin
//             rollback transaction test
//             raiserror('Product type with products is prohibited to delete', 12, 1)
//             return
//         end
//             delete from product_type where id=@productTypeId
//     end try
//     begin catch
//         rollback transaction test
//         raiserror('Product type with products is prohibited to delete', 12, 1)
//         return
//     end catch
// commit transaction test
// end
