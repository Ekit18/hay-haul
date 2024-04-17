// TODO rewrite to trigger
export const deleteProductTypeTrigger = `
create or alter trigger delete_product_type_trigger
ON product_type
after delete
as
BEGIN
    DECLARE @productTypeId varchar(255);
    SELECT @productTypeId = id FROM deleted;

    IF EXISTS (SELECT * FROM product WHERE productTypeId = @productTypeId)
    BEGIN
        RAISERROR('Product type with products is prohibited to delete', 12, 1);
        RETURN;
    END
END
`;

// create or alter procedure delete_product_type_procedure @productTypeId varchar(255) as
// begin
// print @productTypeId
// begin transaction test
//     begin try
//         if exists (select * from product where productTypeId = @productTypeId)
//         begin
//             rollback transaction test
//             raiserror('Product type with products is prohibited to delete', 12, 1)
//             return
//         end
//             delete from product_type where id=@productTypeId
//     end try
//     begin catch
//         rollback transaction test
//         raiserror('Product type with products is prohibited to delete', 12, 1)
//         return
//     end catch
// commit transaction test
// end
