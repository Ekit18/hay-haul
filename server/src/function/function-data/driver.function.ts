export const GET_DRIVER_DETAILS_FUNCTION_NAME = 'get_driver_details'
export const getDriverDetailsFunction = `
CREATE OR ALTER FUNCTION ${GET_DRIVER_DETAILS_FUNCTION_NAME}
   ( @carrierId UNIQUEIDENTIFIER,
    @isAvailable BIT )
RETURNS @data TABLE (
        driverDetailsId uniqueidentifier,
		driverDetailsLicenseId varchar(255),
		driverDetailsStatus varchar(255),
		driverDetailsYearsOfExperience int,
        deliveriesId uniqueidentifier,
        userId uniqueidentifier,
        userEmail VARCHAR(255),
        userFullName VARCHAR(255)
    )
AS
BEGIN 

    DECLARE 
		@driverDetailsId uniqueidentifier,
		@driverDetailsLicenseId varchar(255),
		@driverDetailsStatus varchar(255),
		@driverDetailsYearsOfExperience int,
		@deliveriesId uniqueidentifier,
		@userId uniqueidentifier,
		@userEmail VARCHAR(255),
		@userFullName VARCHAR(255),
		@deliveryStatus varchar(255)

    DECLARE driver_cursor CURSOR FOR 
    SELECT 
        driver_details.id AS driverDetailsId,
		driver_details.licenseId as driverDetailsLicenseId,
		driver_details.status as driverDetailsStatus,
		driver_details.yearsOfExperience as driverDetailsYearsOfExperience,
        delivery.id AS deliveriesId,
        [user].id AS userId,
        [user].email AS userEmail,
        [user].fullName AS userFullName,
		delivery.status as deliveryStatus
    FROM 
        driver_details
    LEFT JOIN 
        delivery ON driver_details.id = delivery.driverId
    LEFT JOIN 
        [user] ON driver_details.userId = [user].id
    WHERE 
        driver_details.carrierId = @carrierId

    OPEN driver_cursor

    FETCH NEXT FROM driver_cursor 
    INTO 
		@driverDetailsId,
		@driverDetailsLicenseId,
		@driverDetailsStatus,
		@driverDetailsYearsOfExperience,
		@deliveriesId,
		@userId,
		@userEmail,
		@userFullName,
		@deliveryStatus

    WHILE @@FETCH_STATUS = 0
    BEGIN
		IF(@isAvailable=1)
		BEGIN
			IF(@deliveriesId IS NULL OR @deliveryStatus = 'Finished')
			BEGIN
				INSERT INTO @data VALUES (
					@driverDetailsId,
					@driverDetailsLicenseId,
					@driverDetailsStatus,
					@driverDetailsYearsOfExperience,
					@deliveriesId,
					@userId,
					@userEmail,
					@userFullName
				)
			END
		END
        ELSE
		BEGIN
			INSERT INTO @data VALUES (
				@driverDetailsId,
				@driverDetailsLicenseId,
				@driverDetailsStatus,
				@driverDetailsYearsOfExperience,
				@deliveriesId,
				@userId,
				@userEmail,
				@userFullName
			)
		END
        FETCH NEXT FROM driver_cursor 
        INTO 
			@driverDetailsId,
			@driverDetailsLicenseId,
			@driverDetailsStatus,
			@driverDetailsYearsOfExperience,
			@deliveriesId,
			@userId,
			@userEmail,
			@userFullName,
			@deliveryStatus
    END

    CLOSE driver_cursor
    DEALLOCATE driver_cursor
	RETURN
END
`