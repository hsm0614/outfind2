// orderservice.js

const mysql = require('mysql2/promise'); // mysql 모듈을 가져옴
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
class OrderService {
    static async findById(orderId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
            return rows[0];
        } finally {
            connection.release();
        }
    }

    static async createOrder(paymentId, orderId, amount, contractor_email, status) {
        const connection = await pool.getConnection();
        try {
            const query = 'INSERT INTO orders (payment_id, order_id, amount, contractor_email, status) VALUES (?, ?, ?, ?, ?)';
            const [result] = await connection.query(query, [paymentId, orderId, amount, contractor_email, status]);
            return result;
        } finally {
            connection.release();
        }
    }
}

module.exports = OrderService;