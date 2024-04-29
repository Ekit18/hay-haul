import { IS_TRANSPORT_IN_USE_FUNCTION_NAME } from 'src/function/function-data/transport.function';
export const UPDATE_OR_DELETE_TRANSPORT_TRIGGER_NAME = 'update_or_delete_transport_trigger'
export const updateOrDeleteTransportTrigger = `
create or alter trigger ${UPDATE_OR_DELETE_TRANSPORT_TRIGGER_NAME}
ON [dbo].[transport]
after update,delete
as
BEGIN
	DECLARE @transportId varchar(255) = (SELECT id FROM inserted);
	IF([dbo].${IS_TRANSPORT_IN_USE_FUNCTION_NAME}(@transportId)=1)
	BEGIN
		raiserror ('Cannot edit transport currently in use', 16, 1);
		rollback transaction;
	END
END
`;