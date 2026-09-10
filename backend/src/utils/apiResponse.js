const send = (res, statusCode, body) => res.status(statusCode).json(body);

export function successResponse(res, data = null, message = "Success", statusCode = 200) {
  return send(res, statusCode, { success: true, message, data });
}

export function errorResponse(res, message = "Something went wrong", statusCode = 500, errors = null) {
  return send(res, statusCode, { success: false, message, errors });
}
