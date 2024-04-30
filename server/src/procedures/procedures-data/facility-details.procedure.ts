export const DELETE_FACILITY_DETAILS_PROCEDURE_NAME = 'delete_facility_details'
export const deleteFacilityDetailsProcedure = `
CREATE OR ALTER PROCEDURE delete_facility_details(
    @id uniqueidentifier
    )
    AS
    BEGIN
        IF(EXISTS (SELECT * FROM [product] WHERE facilityDetailsId=@id))
        BEGIN
            RAISERROR('Cannot delete facility with products',12,1)
            RETURN
        END
        DELETE FROM [facility_details] WHERE id=@id
    END
`