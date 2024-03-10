// export const deleteProductTrigger = `
// create or alter trigger product_type_del_trigger
// on product_type
// after delete
// as
// declare @productTypeId varchar(255);
// select @productTypeId = id from deleted;
// if exists (select * from product where productTypeId = @productTypeId)
// begin
//     rollback tran
// end
// `;

export const deleteProductTypeProcedure = `
create or alter procedure delete_product_type_procedure @productTypeId varchar(255) as
begin
    print @productTypeId
    begin transaction test
        begin try
            if exists (select * from product where productTypeId = @productTypeId)
            begin
                rollback transaction test
                raiserror('Product type with products is prohibited to delete', 12, 1)
                return
            end
                delete from product_type where id=@productTypeId
        end try
        begin catch
            rollback transaction test
            raiserror('Product type with products is prohibited to delete', 12, 1)
            return
        end catch
    commit transaction test
end
`;
