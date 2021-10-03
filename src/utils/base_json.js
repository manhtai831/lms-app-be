module.exports.baseJson = function (status, data) {
    return {
        status: status,
        message: status === 0 ? "Success" : "Error",
        data: data,
    }
}
module.exports.baseJsonPage = function (index, size,total,data) {
    return {
        pageIndex: index,
        pageSize:size,
        totalPage:Math.floor(total/size < 1 ? 1: total/size),
        recordTotal:total,

        data: data,
    }
}