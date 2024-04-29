export const IS_TRANSPORT_IN_USE_FUNCTION_NAME = 'is_transport_in_use'
export const isTransportInUse = `
create or alter function ${IS_TRANSPORT_IN_USE_FUNCTION_NAME}(@transportId varchar(255))
RETURNS bit
AS
BEGIN
	DECLARE @result bit;
	SET @result = CASE 
		WHEN EXISTS (SELECT id FROM [dbo].[delivery] WHERE transportId=@transportId AND status != 'Finished')
		THEN 1
		ELSE 0
		END
	RETURN @result;
END
`

export const GET_AVAILABLE_TRANSPORT_FUNCTION_NAME = 'get_available_transport'
export const getAvailableTransport = `
CREATE OR ALTER FUNCTION get_available_transport    (@carrierId UNIQUEIDENTIFIER)
    RETURNS @availableTransport TABLE(
		[createdAt] datetime2(7),
		[updatedAt] datetime2(7),
		[id] uniqueidentifier,
		[name] nvarchar(255),
		[licensePlate] nvarchar(255),
		[type] nvarchar(255),
		[carrierId] uniqueidentifier
    )
AS
BEGIN

DECLARE 
    @transport_createdAt datetime2(7),
    @transport_updatedAt datetime2(7),
    @transport_id uniqueidentifier,
    @transport_name nvarchar(255),
    @transport_licensePlate nvarchar(255),
    @transport_type nvarchar(255),
    @transport_carrierId uniqueidentifier,

    @deliveries_transportId uniqueidentifier,
    @deliveries_status nvarchar(255);


DECLARE transport_cursor CURSOR FOR 
    SELECT 
	"transport"."createdAt" AS "transport_createdAt",
	"transport"."updatedAt" AS "transport_updatedAt",
	"transport"."id" AS "transport_id",
	"transport"."name" AS "transport_name",
	"transport"."licensePlate" AS "transport_licensePlate",
	"transport"."type" AS "transport_type",
	"transport"."carrierId" AS "transport_carrierId",
	"deliveries"."transportId" AS "deliveries_transportId",
	"deliveries"."status" AS "deliveries_status"
	FROM "transport" "transport" 
		LEFT JOIN "delivery" "deliveries" 
			ON "deliveries"."transportId"="transport"."id"
		LEFT JOIN "delivery_order" "deliveryOrder" 
			ON "deliveryOrder"."id"="deliveries"."deliveryOrderId"
	WHERE "transport"."carrierId" = @carrierId

	OPEN transport_cursor

    FETCH NEXT FROM transport_cursor 
    INTO 
		@transport_createdAt,
		@transport_updatedAt,
		@transport_id,
		@transport_name,
		@transport_licensePlate,
		@transport_type,
		@transport_carrierId,
		@deliveries_transportId,
		@deliveries_status;

WHILE @@FETCH_STATUS = 0
BEGIN
    IF(@deliveries_status = 'Finished' OR @deliveries_status IS NULL)
        BEGIN
			INSERT INTO @availableTransport 
			VALUES (
				@transport_createdAt,
				@transport_updatedAt,
				@transport_id,
				@transport_name,
				@transport_licensePlate,
				@transport_type,
				@transport_carrierId
			)
        END
	ELSE
		BEGIN
			DELETE @availableTransport WHERE id=@transport_id
		END

    FETCH NEXT FROM transport_cursor 
    INTO 
		@transport_createdAt,
		@transport_updatedAt,
		@transport_id,
		@transport_name,
		@transport_licensePlate,
		@transport_type,
		@transport_carrierId,
		@deliveries_transportId,
		@deliveries_status
	
END 

CLOSE transport_cursor
DEALLOCATE transport_cursor

RETURN
END
`