import { DOES_USER_HAVE_ID_FUNCTION_NAME } from 'src/function/function-data/token.function'

export const CREATE_TOKEN_TRIGGER_NAME = 'create_token_trigger'

export const createTokenTrigger = `
create or alter trigger ${CREATE_TOKEN_TRIGGER_NAME}
ON [dbo].[token] 
instead of insert
as
BEGIN
	DECLARE @userId varchar(255) = (SELECT id FROM inserted);
	IF([dbo].${DOES_USER_HAVE_ID_FUNCTION_NAME}(@userId)=0)
	BEGIN
		INSERT INTO [dbo].[token] (refreshToken,userId)
			SELECT I.refreshToken, I.userId FROM inserted I
	END
END
`