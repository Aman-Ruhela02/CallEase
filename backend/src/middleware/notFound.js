import AppError from "../utils/AppError.js";

export default function notFound(req, res, next) {
  const message = `Route '${req.originalUrl}' not found`
  next(new AppError(message, 404));
}
