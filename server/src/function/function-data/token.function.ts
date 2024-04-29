export const DOES_USER_HAVE_ID_FUNCTION_NAME = 'does_user_have_token'
export const doesUserHaveIdFunction = `
create or alter function ${DOES_USER_HAVE_ID_FUNCTION_NAME}(@userId varchar(255))
RETURNS bit
AS
BEGIN
 DECLARE @result bit;
	SET @result = CASE 
		WHEN EXISTS (SELECT id FROM [dbo].[token] WHERE userId=@userId)
		THEN 1
		ELSE 0
		END
 RETURN @result;
END
`