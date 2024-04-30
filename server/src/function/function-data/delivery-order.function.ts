export const GET_ALL_LOCATIONS_FUNCTION_NAME = 'get_all_locations'
export const getAllLocationsFunction = `
CREATE OR ALTER function ${GET_ALL_LOCATIONS_FUNCTION_NAME}(
	@userId uniqueidentifier=NULL,
	@carrierId uniqueidentifier=NULL
)
RETURNS @response TABLE(
	[address] nvarchar(255),
	[isDepot] bit
)
AS
BEGIN
	DECLARE 
		@productAddress varchar(255),
		@depotAddress varchar(255),
		@deliveryOffers_userId uniqueidentifier,
		@deliveryOrderStatus varchar(255),
		@chosenOffer_userId uniqueidentifier,
		@order_userId uniqueidentifier

	DECLARE table_cursor CURSOR  FOR 
	SELECT 
		[productFacilityDetails].address,
		[depotFacilityDetails].address,
		[deliveryOffers].userId,
		[delivery_order].deliveryOrderStatus,
		[chosenOffer].userId,
		[delivery_order].userId
	FROM [delivery_order] 
		LEFT JOIN [delivery_offer] [deliveryOffers] ON
			[delivery_order].id=[deliveryOffers].deliveryOrderId
		LEFT JOIN [delivery_offer] [chosenOffer] ON
			[delivery_order].chosenDeliveryOfferId=[chosenOffer].id
		LEFT JOIN [product_auction] ON
			[delivery_order].productAuctionId=[product_auction].id
		LEFT JOIN [product] ON
			[product_auction].productId=[product].id
		LEFT JOIN [facility_details] as [productFacilityDetails] ON
			[product].facilityDetailsId=[productFacilityDetails].id
		LEFT JOIN [facility_details] as [depotFacilityDetails] ON
            [delivery_order].depotId=[depotFacilityDetails].id


	OPEN table_cursor

	FETCH NEXT FROM table_cursor
	INTO
		@productAddress,
		@depotAddress,
		@deliveryOffers_userId,
		@deliveryOrderStatus,
		@chosenOffer_userId,
		@order_userId
		
	WHILE @@FETCH_STATUS = 0
    BEGIN
		IF(@carrierId IS NOT NULL)
		BEGIN
			IF(
				(
					@deliveryOffers_userId = @carrierId AND
					@deliveryOrderStatus='Active'
				)
				OR
				(
					@chosenOffer_userId=@carrierId AND
					@deliveryOrderStatus IN ('Paid','WaitingPayment')
				)
			)
			BEGIN
				IF(@userId IS NOT NULL)
				BEGIN
					IF(
						@order_userId=@userId
					)
					BEGIN
						IF(NOT EXISTS (SELECT * FROM @response WHERE address=@productAddress and isDepot=0))
						BEGIN
							INSERT INTO @response (address,isDepot) VALUES (@productAddress,0)
						END
						IF(NOT EXISTS (SELECT * FROM @response WHERE address=@depotAddress and isDepot=1))
						BEGIN
							INSERT INTO @response (address,isDepot) VALUES (@depotAddress,1)
						END
					END
				END
				ELSE
				BEGIN
					IF(NOT EXISTS (SELECT * FROM @response WHERE address=@productAddress and isDepot=0))
					BEGIN
						INSERT INTO @response (address,isDepot) VALUES (@productAddress,0)
					END
					IF(NOT EXISTS (SELECT * FROM @response WHERE address=@depotAddress and isDepot=1))
					BEGIN
						INSERT INTO @response (address,isDepot) VALUES (@depotAddress,1)
					END
				END
			END
		END
		ELSE IF(@userId IS NOT NULL)
		BEGIN
			IF(
				@order_userId=@userId
			)
			BEGIN
				IF(NOT EXISTS (SELECT * FROM @response WHERE address=@productAddress and isDepot=0))
				BEGIN
					INSERT INTO @response (address,isDepot) VALUES (@productAddress,0)
				END
				IF(NOT EXISTS (SELECT * FROM @response WHERE address=@depotAddress and isDepot=1))
				BEGIN
					INSERT INTO @response (address,isDepot) VALUES (@depotAddress,1)
				END
			END
		END
		ELSE
		BEGIN
			IF(@deliveryOrderStatus = 'Active')
			BEGIN
				IF(NOT EXISTS (SELECT * FROM @response WHERE address=@productAddress and isDepot=0))
				BEGIN
					INSERT INTO @response (address,isDepot) VALUES (@productAddress,0)
				END
				IF(NOT EXISTS (SELECT * FROM @response WHERE address=@depotAddress and isDepot=1))
				BEGIN
					INSERT INTO @response (address,isDepot) VALUES (@depotAddress,1)
				END
			END
		END

		FETCH NEXT FROM table_cursor
	INTO
		@productAddress,
		@depotAddress,
		@deliveryOffers_userId,
		@deliveryOrderStatus,
		@chosenOffer_userId,
		@order_userId

	END

	CLOSE table_cursor
    DEALLOCATE table_cursor

	RETURN
END
`