export const insertUserTrigger = `
create or alter trigger insert_user_trigger
ON [dbo].[user]
after insert
as
BEGIN
	declare @newUserId varchar(255);
	declare @verificationStatus binary = 0;
	SELECT @newUserId = id FROM inserted

    IF EXISTS (SELECT * FROM inserted d WHERE d.role = 'Driver')
	BEGIN
		SET @verificationStatus = 1
	END

	UPDATE [dbo].[user] SET isVerified=@verificationStatus WHERE id=@newUserId
END
`;