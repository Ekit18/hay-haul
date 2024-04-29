
export const isTransportInUse = `
create or alter function is_transport_in_use(@transportId varchar(255))
RETURNS bit
AS
BEGIN
	DECLARE @result bit;
	SET @result = CASE 
		WHEN EXISTS (SELECT id FROM [dbo].[delivery] WHERE transportId=@transportId AND status='Finished')
		THEN 1
		ELSE 0
		END
	RETURN @result;
END
go
`