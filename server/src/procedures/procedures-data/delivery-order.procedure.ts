export const DELETE_ORDER_BY_ID_PROCEDURE_NAME = 'delete_order_by_id'
export const deleteOrderByIdProcedure = `
CREATE OR ALTER PROCEDURE ${DELETE_ORDER_BY_ID_PROCEDURE_NAME}(@id uniqueidentifier,@userId uniqueidentifier)
AS
BEGIN
	DECLARE @currId uniqueidentifier, @currUserId uniqueidentifier, @orderStatus varchar(255);

	DECLARE table_cursor CURSOR FOR SELECT id, userId, deliveryOrderStatus FROM [delivery_order]

    OPEN table_cursor

	FETCH NEXT FROM table_cursor INTO @currId, @currUserId, @orderStatus

	WHILE @@FETCH_STATUS = 0
	BEGIN
		IF(@currId = @id)
		BEGIN
			IF(@currUserId != @userId)
			BEGIN
				CLOSE table_cursor
				DEALLOCATE table_cursor
				RAISERROR('You are not authorized to delete this delivery order',12,1)
				RETURN
			END
			IF(@orderStatus != 'Inactive')
			BEGIN
				CLOSE table_cursor
				DEALLOCATE table_cursor
				RAISERROR('You cannot delete an active delivery order',12,1)
				RETURN
			END
			DELETE FROM [delivery_order] WHERE CURRENT OF table_cursor
			CLOSE table_cursor
			DEALLOCATE table_cursor
			RETURN
		END
		FETCH NEXT FROM table_cursor INTO @currId, @currUserId, @orderStatus
	END
END
`