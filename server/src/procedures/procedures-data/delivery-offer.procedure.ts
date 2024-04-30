export const CREATE_OFFER_PROCEDURE_NAME = 'create_delivery_offer'
export const createOfferProcedure = `
CREATE OR ALTER PROCEDURE ${CREATE_OFFER_PROCEDURE_NAME}(
@orderId uniqueidentifier,
@price int,
@userId uniqueidentifier
)
AS
BEGIN
	DECLARE @currPrice int = NULL;

	SELECT @currPrice=price FROM [delivery_offer] WHERE deliveryOrderId=@orderId and userId=@userId

	IF (@currPrice IS NOT NULL)
	BEGIN
		IF(@currPrice=@price)
		BEGIN
			RAISERROR('Cannot set the same price as the previous offer',12,1)
			RETURN
		END
		UPDATE [delivery_offer] SET price=@price,offerStatus='Pending' WHERE deliveryOrderId=@orderId and userId=@userId
	END
	ELSE
	BEGIN
		INSERT INTO [delivery_offer] (price,deliveryOrderId,userId) VALUES (@price,@orderId,@userId)
	END
END
`