type IOptions= {
    page?:number|string,
    limit?:number|string,
    sortby?:string
    sortOrder?:string
}
type IOptionsResuts={
    page:number,
    limit:number,
    skip:number,
    sortby:string,
    sortOrder:string
}
const paginationSortingHeplers=(options:IOptions):IOptionsResuts=>{
         const page=Number(options.page)||1;
         const limit=Number(options.limit)||10
         const skip=(page-1)*limit
         const  sortby= options.sortby || "createdAt";
         const  sortOrder=options.sortOrder || "asc"

         return {
            page,limit,skip,sortby,sortOrder
         }
}
export default paginationSortingHeplers;