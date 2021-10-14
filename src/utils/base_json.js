const { getNowFormatted } = require("../utils/utils");

module.exports.baseJson = function ({ code, message, data }) {
	return {
		time: getNowFormatted(),
		error: jsonError({ code: code, message: message }),
		data: data ?? {},
	};
};

function jsonError({ code, message }) {
	return {
		code: code,
		message: message ?? (code === 0 ? "Success" : "Error"),
	};
}

module.exports.baseJsonPage = function (index, size, total, data) {
	return {
		pageIndex: index,
		pageSize: size,
		totalPage: Math.ceil(total / size < 1 ? 1 : total / size),
		recordTotal: total,
		data: data,
	};
};
