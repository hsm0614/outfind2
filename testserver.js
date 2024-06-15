const express = require("express");
const session = require('express-session'); // express-session 모듈 추가
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const uuid = require('uuid').v4; // uuid 패키지를 사용하여 고유한 세션 ID 생성
require('dotenv').config(); // .env 파일에서 환경 변수를 로드합니다.
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // JWT 패키지 임포트
const OrderService = require('./orderservice');




const options = {
    key: fs.readFileSync('/etc/letsencrypt/archive/www.outfind.co.kr/privkey3.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.outfind.co.kr/fullchain.pem')
};
https.createServer(options, app).listen(3000, () => {

});

const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

// 토큰을 검증하는 함수
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error('Token verification error:', error);
        throw new Error('Invalid token');
    }
}


function createToken(email) {
    // payload는 객체여야 합니다
    const payload = { email };
    try {
        
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        return token;
    } catch (error) {

        console.error('Token creation error:', error);
        throw new Error('Token creation error');
    }
}

// body-parser 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'https://outfind.co.kr',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://www.outfind.co.kr"); // 특정 도메인 허용
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


// Express 애플리케이션에서 세션 사용 설정
app.use(session({
    genid: (req) => uuid(), // 세션 ID 생성 함수로 uuid 사용
    secret: 'my-secret-key', // 세션 암호화에 사용될 키
    resave: false,
    saveUninitialized: true
}));

// JSON 파싱을 위한 미들웨어 추가
app.use(bodyParser.json());

// mysql 모듈을 불러옵니다.
const mysql = require('mysql');

// MySQL 서버 연결 설정
const connection = mysql.createConnection({
  host: '43.202.132.220', // MySQL 호스트 주소
  user: 'ubuntu', // MySQL 사용자 이름
  password: 'tjdals0912!', // MySQL 비밀번호
  database: 'outfind', // 사용할 데이터베이스 이름
  port: '3306'
});

// MySQL 서버 연결
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
});

// 정적 파일 미들웨어 설정
app.use(express.static(path.join(__dirname, 'outfind2', 'image')));
app.use(express.static(path.join(__dirname, 'outfind2')));


// 루트 경로에 대한 요청 처리
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "maintpage.html")); // 절대 경로를 사용하여 파일 보내기
});

app.get("/mainpage.css", function(req, res){
    res.sendFile(path.join(__dirname, "mainpage.css"));
});
app.get("/mainpagemob.css", function(req, res){
    res.sendFile(path.join(__dirname, "mainpagemob.css"));
});


// 회원가입 패이지
app.get("/signuppage/signup.html", function(req, res){
    res.sendFile(path.join(__dirname, "signuppage", "signup.html"));
});
app.get("/signuppage/singup.css", function(req, res){
    res.sendFile(path.join(__dirname, "signuppage", "singup.css"));
});
app.get("/signuppage/signupmob.css", function(req, res){
    res.sendFile(path.join(__dirname, "signuppage", "signupmob.css"));
});
app.get('/signuppage/signup.js', function(req, res) {
    res.type('text/javascript');
    res.sendFile(__dirname + '/signuppage/signup.js');
});

// 로그인페이지
app.get("/loginpage/loginpage.html", function(req, res){
    res.sendFile(path.join(__dirname, "loginpage", "loginpage.html"));
});
app.get("/loginpage/login.css", function(req, res){
    res.sendFile(path.join(__dirname, "loginpage", "login.css"));
});
app.get("/loginpage/loginmob.css", function(req, res){
    res.sendFile(path.join(__dirname, "loginpage", "loginmob.css"));
});
app.get('/loginpage/login.js', function(req, res) {
    res.type('text/javascript');
    res.sendFile(__dirname + '/loginpage/login.js');
});

//마이페이지
app.get("/mypage/mypage.html", function(req, res){
    res.sendFile(path.join(__dirname, "mypage", "mypage.html"));
});
app.get("/mypage/mypage.css", function(req, res){
    res.sendFile(path.join(__dirname, "mypage", "mypage.css"));
});
app.get('/mypage/mypage.js', function(req, res) {
    res.type('text/javascript');
    res.sendFile(__dirname + '/mypage/mypage.js');
});

// 이미지 파일에 대한 요청 처리
app.get("/image/mainpageimage.png", function(req, res){
  res.sendFile(path.join(__dirname, 'image', 'mainpageimage.png'));
});

app.get("/image/savemoney.png", function(req, res){
    res.sendFile(path.join(__dirname, 'image', 'savemoney.png'));
  });

  app.get("/image/savetime.png", function(req, res){
    res.sendFile(path.join(__dirname, 'image', 'savetime.png'));
  });
  
  app.get("/image/goodcontract.png", function(req, res){
    res.sendFile(path.join(__dirname, 'image', 'goodcontract.png'));
  });

  app.get("/image/manage.png", function(req, res){
    res.sendFile(path.join(__dirname, 'image', 'manage.png'));
  });

  app.get("/image/BM.png", function(req, res){
    res.sendFile(path.join(__dirname, 'image', 'BM.png'));
  });

  app.get("/image/loginimage.png", function(req, res){
    res.sendFile(path.join(__dirname, 'image', 'loginimage.png'));
  });

// testserver.js 파일 제공
app.get("/testserver.js", function(req, res){
    res.sendFile(path.join(__dirname, "testserver.js"), {
        headers: {
            'Content-Type': 'text/javascript' // MIME 타입을 'text/javascript'로 설정
        }
    });
});


// 기업 회원가입 요청 처리
app.post('/signuppage/signup.html/signup/company', (req, res) => {
  // 회원가입 폼에서 전송된 데이터 받아오기
  const { businessNumber, companyName, companyRepresentative, companyEmail, companyPassword, companyAddress, companyAddressDetails, companyIntroduction } = req.body;

// MySQL 데이터베이스에 기업회원 정보를 삽입하는 쿼리 실행
const sql = `INSERT INTO company (business_number, company_name, representatinve_name, email, password, address, address_details, introduction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
 connection.query(sql, [businessNumber, companyName, companyRepresentative, companyEmail, companyPassword, companyAddress, companyAddressDetails, companyIntroduction], (error, results, fields) => {
    if (error) {
      console.error('MySQL 데이터베이스에 회원 정보 삽입 중 오류 발생:', error);
      res.status(500).send('회원가입 중 오류가 발생했습니다.');
      return;
    }
    res.send("complete");
  });
});

// 이메일 중복 확인 엔드포인트
app.post('/check-email', (req, res) => {
    const { email } = req.body;

    // 이메일 중복 확인 쿼리 실행
    const sql = 'SELECT COUNT(*) AS count FROM company WHERE email = ?';
    connection.query(sql, [email], (error, results, fields) => {
        if (error) {
            console.error('MySQL 데이터베이스에서 이메일 중복 확인 중 오류 발생:', error);
            res.status(500).json({ error: '이메일 중복 확인 중 오류 발생' });
            return;
        }

        const count = results[0].count;
        res.json({ exists: count > 0 });
    });
});

// 인력도급 회원가입 요청 처리
app.post('/signuppage/signup.html/signup/contractor', (req, res) => {
    // 클라이언트에서 전송된 데이터 받아오기
    const { businessNumber, contractorname, email, password, industry, subIndustry, location, contractorintroduction } = req.body;

    // 새로운 회원 정보를 MySQL 데이터베이스에 추가하는 쿼리 실행
    const sql = `INSERT INTO contractors (business_number, contractor_name, email, password, industry, sub_industry, location, introduction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [businessNumber, contractorname, email, password, industry, subIndustry, location, contractorintroduction], (error, results, fields) => {
        if (error) {
            console.error('MySQL 데이터베이스에 회원 정보 삽입 중 오류 발생:', error);
            res.status(500).send('회원가입 중 오류가 발생했습니다.');
            return;
        }
        res.send('complete');
    });
});

// 인력도급 이메일 중복 확인 엔드포인트
app.post('/check-contractor-email', (req, res) => {
    const { email } = req.body;

    // 이메일 중복 확인 쿼리 실행
    const sql = 'SELECT COUNT(*) AS count FROM contractors WHERE email = ?';
    connection.query(sql, [email], (error, results, fields) => {
        if (error) {
            console.error('MySQL 데이터베이스에서 이메일 중복 확인 중 오류 발생:', error);
            res.status(500).json({ error: '이메일 중복 확인 중 오류 발생' });
            return;
        }

        const count = results[0].count;
        res.json({ exists: count > 0 });
    });
});
// 기업 로그인 처리
app.post("/loginpage/loginpage.html/login/company", function(req, res) {

    const { companyEmail, companyPassword } = req.body;

    const query = `SELECT * FROM company WHERE email = ? AND password = ?`;
    connection.query(query, [companyEmail, companyPassword], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('로그인 중 오류가 발생했습니다.');
            return;
        }

        if (results.length > 0) {
            const token = createToken(results[0].email); // 토큰 생성 함수 호출
            res.json({ companyEmail: companyEmail, token: token, userType: 'company' });
        }else {
            res.status(401).send("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    });
});
// 인력도급 로그인 처리
app.post("/loginpage/loginpage.html/login/contractor", function(req, res) {
    // 로그인 폼에서 전송된 데이터 받아오기
    const { contractorEmail, contractorPassword } = req.body;

    // MySQL 데이터베이스에서 해당 이메일을 가진 사용자를 찾음
    const query = `SELECT * FROM contractors WHERE email = ? AND password = ?`;
    connection.query(query, [contractorEmail, contractorPassword], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('로그인 중 오류가 발생했습니다.');
            return;
        }

        if (results.length > 0) {
            // 로그인 성공 시 세션에 사용자 정보 저장
            req.session.user = results[0]; // 여기서는 첫 번째 결과만 사용 (단일 사용자)
            const token = jwt.sign({ userId: results[0].id }, secretKey);
                // 토큰을 클라이언트에게 반환
                res.json({ contractorEmail: contractorEmail, token: token, userType: 'contractor' });
        } else {
            res.status(401).send("이메일 또는 비밀번호가 올바르지 않습니다."); // 로그인 실패 시 실패 메시지를 클라이언트로 보냄
        }
    });
});

// 서버 측 로그아웃 처리
app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).send('로그아웃 중 오류가 발생했습니다.');
        } else {
            // 로그아웃 성공 시 클라이언트에게 성공 응답 보내기
            res.send('로그아웃이 완료되었습니다.');
        }
    });
});


// POST 요청을 처리하는 라우터 설정
app.post('/', function(req, res) {
    // 클라이언트로부터 받은 데이터 추출
    var businessNumber = req.body.businessNumber;  
    var companyName = req.body.companyName;
    var representativeName = req.body.representativeName;
    var email = req.body.email;
    var password = req.body.password;
    var address = req.body.address;
    var addressDetails = req.body.addressDetails;
    var introduction = req.body.introduction;

    // 이후에 데이터베이스에 데이터 삽입 등의 작업 수행
});



// 보호된 페이지 요청 처리
app.get('/protected', function(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        res.send('Authenticated');
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

// 로그인 요청 처리 예제
app.post("/login", function(req, res) {
    const userType = req.body.userType;
    const token = createToken(user);
    
    res.json({ token: token, userType: userType });
});

app.post('/submit-company-info', (req, res) => {
    const { name, email, phone, project_name, industry, location, number_of_people, projectstructure } = req.body;
    const sql = 'INSERT INTO modal (name, email, phone, project_name, industry, location, number_of_people, projectstructure) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [name, email, phone, project_name, industry, location, number_of_people, projectstructure], (err, result) => {
      if (err) {
        console.error('Error inserting company info: ', err);
        res.status(500).json({ error: 'Error inserting company info' });
        return;
      }
      res.sendStatus(200);
    });
  });

// 클라이언트에서 전송된 정보를 사용하여 DB에서 매칭된 인력도급 업체를 찾고 결과를 반환하는 엔드포인트
app.post('/matching-companies', (req, res) => {
    const { industry, location } = req.body;
    // DB에서 매칭된 인력도급 업체를 조회하는 쿼리 작성
    const query = `SELECT *, introduction FROM contractors WHERE industry = ? AND location = ?`;

    // 쿼리 실행
    connection.query(query, [industry, location], (err, results) => {
        if (err) {
            console.error('Error matching companies:', err);
            res.status(500).json({ error: 'Error matching companies' });
            return;
        }

        const selectedCompanies = selectRandomCompanies(results, 5);

        // 매칭된 업체 정보를 클라이언트에게 반환
        res.json({ matchingCompanies: selectedCompanies });
        });
    });


// 배열에서 무작위로 원하는 개수의 요소를 선택하는 함수
function selectRandomCompanies(companies, count) {
    const totalCompanies = companies.length;

    // 요청된 개수가 배열의 길이보다 큰 경우 배열의 길이를 사용
    const selectedCount = Math.min(count, totalCompanies);

    // Fisher-Yates 셔플링 알고리즘을 사용하여 배열을 섞음
    for (let i = totalCompanies - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [companies[i], companies[j]] = [companies[j], companies[i]];
    }

    // 매칭된 개수만큼 선택
    return companies.slice(0, selectedCount);
}

app.post('/submit-contractor-emails', (req, res) => {
    const nowEmail = req.body.nowEmail;
    let contractorEmails = req.body.contractorEmails;

    // contractorEmails 배열이 5개의 요소를 갖도록 조정
    if (contractorEmails.length > 5) {
        contractorEmails = contractorEmails.slice(0, 5);
    } else {
        while (contractorEmails.length < 5) {
            contractorEmails.push(null); // 배열의 길이가 5보다 작을 경우 null로 채움
        }
    }

    // 최근 모달 ID 조회 쿼리
    const modalIdQuery = `SELECT id FROM modal WHERE email = ? ORDER BY id DESC LIMIT 1`;

    // 최근 모달 ID 조회
    connection.query(modalIdQuery, [nowEmail], (modalErr, modalResults) => {
        if (modalErr) {
            console.error('Error getting recent modal ID:', modalErr);
            res.status(500).json({ error: 'Error getting recent modal ID' });
            return;
        }
        

        const modalId = modalResults.length > 0 ? modalResults[0].id : null;

        // 매칭 정보 삽입
        const matchingInfoQuery = `INSERT INTO matchinginfo (modal_id, contractor_email1, contractor_email2, contractor_email3, contractor_email4, contractor_email5, company_email) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const queryParameters = [modalId, ...contractorEmails, nowEmail];
        connection.query(matchingInfoQuery, queryParameters, (insertErr, insertResult) => {
            if (insertErr) {
                console.error('Error inserting matching info:', insertErr);
                res.status(500).send('Error inserting matching info');
                return;
            }

            res.status(200).send('Matching info inserted successfully');
        });
    });
});

// 매칭된 업체 정보를 가져오는 엔드포인트
app.post('/matching-info', (req, res) => {
    const nowEmail = req.body.nowEmail;
  
    // 최근 modal_id를 가져오는 SQL 쿼리
    const modalIdQuery = `
        SELECT modal_id
        FROM matchinginfo
        WHERE company_email = ?
        ORDER BY modal_id DESC
        LIMIT 1
    `;
    // SQL 쿼리 실행
    connection.query(modalIdQuery, [nowEmail], (modalErr, modalResults) => {
        if (modalErr) {
            console.error('Error fetching modal ID:', modalErr);
            res.status(500).json({ error: 'Error fetching modal ID' });
            return;
        }

        // 매칭된 정보가 없는 경우 빈 배열을 반환
        if (modalResults.length === 0) {
            res.json({ matchingInfo: [] });
            return;
        }

        const modalId = modalResults[0].modal_id;

        // 매칭된 업체 정보를 가져오는 SQL 쿼리
        const matchingInfoQuery = `
            SELECT c.email, c.industry, c.sub_industry, c.location, c.introduction
            FROM matchinginfo mi
            JOIN contractors c
            ON mi.contractor_email1 = c.email OR mi.contractor_email2 = c.email 
            OR mi.contractor_email3 = c.email OR mi.contractor_email4 = c.email 
            OR mi.contractor_email5 = c.email
            WHERE mi.modal_id = ?
        `;
        
        // SQL 쿼리 실행
        connection.query(matchingInfoQuery, [modalId], (err, results) => {
            if (err) {
                console.error('Error fetching matching info:', err);
                res.status(500).json({ error: 'Error fetching matching info' });
                return;
            }

            // 매칭된 업체 정보를 클라이언트로 응답
            res.json({ matchingInfo: results });
        });
    });
});


// 클라이언트로부터 매칭 요청 받기
app.post('/submit-matching-request', (req, res) => {
    const { contractorEmail, companyEmail, status } = req.body;

    // 예시: 최근 모달을 참조하여 매칭 정보를 데이터베이스에 저장하는 SQL 쿼리
    const sql = 'INSERT INTO matching (company_email, contractor_email, status, modal_id) VALUES (?, ?, ?, (SELECT id FROM modal WHERE email = ? ORDER BY id DESC LIMIT 1))';
    connection.query(sql, [companyEmail, contractorEmail, status, companyEmail], (err, result) => {
        if (err) {
            console.error('Error saving matching request to database:', err);
            res.status(500).json({ error: 'Error saving matching request to database' });
            return;
        }
        res.json({ success: true, message: 'Matching request saved successfully' });
    });
});
app.post('/get-matching-status', (req, res) => {
    const { contractorEmail, companyEmail } = req.body;
    
    // 매칭 상태를 데이터베이스에서 가져오는 쿼리 수행

    // 예시: 데이터베이스에서 매칭 상태를 가져오는 SQL 쿼리
    const sql = 'SELECT status FROM matching WHERE contractor_email = ? AND company_email = ?';
    connection.query(sql, [contractorEmail, companyEmail], (err, result) => {
        if (err) {
            console.error('Error fetching matching status:', err);
            res.status(500).json({ error: 'Error fetching matching status' });
            return;
        }
        // 매칭 상태 응답
        const status = result.length > 0 ? result[0].status : 'none';
        res.json({ status });
    });
});


app.post('/check-matching', (req, res) => {
    const contractorEmail = req.body.contractorEmail;

    // 매칭된 기업 정보 및 프로젝트 정보 조회하는 쿼리 작성
    const query = `
    SELECT m.company_email, c.project_name, c.industry, c.number_of_people, c.phone, m.status    FROM matching m 
    INNER JOIN modal c ON m.modal_id = c.id
    WHERE m.contractor_email = ? AND (m.status = 'matching' OR m.status = 'accepted')
    ORDER BY c.project_name;
    `;

    // 쿼리 실행
    connection.query(query, [contractorEmail], (err, results) => {
        if (err) {
            res.status(500).json();
            return;
        }

        if (results.length === 0) {
            res.status(404).json();
            return;
        }

        // 매칭된 기업 정보와 프로젝트 정보를 클라이언트에 반환
        res.json({ matchingCompanies: results });
    });
});


// 매칭 수락 요청 처리
app.post('/accept-match', (req, res) => {
    const contractorEmail = req.body.contractorEmail;
    const companyEmail = req.body.companyEmail;

    // 매칭 정보를 데이터베이스에 저장하는 SQL 쿼리
    const sql = 'INSERT INTO accepted_matches (company_email, contractor_email) VALUES (?, ?)';
    connection.query(sql, [companyEmail, contractorEmail], (err, result) => {
        if (err) {
            console.error('Error saving accepted match:', err);
            res.status(500).json({ error: 'Error saving accepted match' });
            return;
        }

        const sql = 'UPDATE matching SET status = ? WHERE company_email = ? AND contractor_email = ?';
    connection.query(sql, ['accepted', companyEmail, contractorEmail], (err, result) => {
        if (err) {
            console.error('Error updating matching status:', err);
            res.status(500).json({ error: 'Error updating matching status' });
            return;
        }
        res.status(200).json({ message: '매칭이 성공적으로 수락되었습니다.' });
        });
    });
});

app.post('/reject-match', (req, res) => {
    const contractorEmail = req.body.contractorEmail;
    const companyEmail = req.body.companyEmail;

    // 매칭 정보를 삭제하는 SQL 쿼리 작성
    const query = `
        DELETE FROM matching 
        WHERE company_email = ? AND contractor_email = ?
    `;
    
    // 데이터베이스에서 매칭 정보 삭제
    connection.query(query, [companyEmail, contractorEmail], (err, result) => {
        if (err) {
            console.error('Error deleting matching data from MySQL:', err);
            res.status(500).json({ error: 'Error deleting matching data from MySQL' });
            return;
        }

        res.json({ success: true, message: 'Matching data deleted successfully' });
    });
});


// 매칭된 인력 조회
app.post('/check-company-matching', (req, res) => {
    const companyEmail = req.body.companyEmail;
  
    // 매칭된 인력 정보 조회하는 쿼리 작성
    const query = `
    SELECT c.email AS contractor_email, c.introduction, c.industry, c.location, m.status
    FROM matching m
    INNER JOIN contractors c ON m.contractor_email = c.email
    WHERE m.company_email = ? AND (m.status = 'matching' OR m.status = 'accepted')
    `;
  
    // 쿼리 실행
    connection.query(query, [companyEmail], (err, results) => {
        if (err) {
          console.error('Error querying matching data from MySQL:', err);
          res.status(500).json({ error: 'Error querying matching data from MySQL' });
          return;
        }
      
        if (results.length === 0) {
          res.status(404).json({ error: 'No matching data found' });
          return;
        }
      
        // 매칭된 인력 정보를 클라이언트에 반환
        res.json({ matchingContractors: results });
    });
});

app.post('/order/create', async (req, res) => {
    try {
        const { paymentId, orderId, amount, contractor_email, status } = req.body; // 요청에서 데이터 추출

        // 필수 필드가 누락된 경우
        if (!paymentId || !orderId || !amount || !contractor_email || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await OrderService.createOrder(paymentId, orderId, amount, contractor_email, status); // 주문 생성 및 저장
        res.status(200).json({ success: true, message: '주문이 성공적으로 생성되었습니다.' });
    } catch (error) {
        console.error('주문 생성 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '주문 생성 중 오류가 발생했습니다.' });
    }
});
app.post("/payment/complete", async (req, res) => {
    try {
        const { paymentId, orderId } = req.body; // paymentId와 orderId 추출


        if (!paymentId || !orderId) { // paymentId와 orderId가 누락되었는지 확인
            return res.status(400).send({ message: "Missing required fields" });
        }

        const paymentResponse = await fetch(
            `https://api.portone.io/payments/${paymentId}`,
            { headers: { Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` } }
        );

        if (!paymentResponse.ok) {
            const errorText = await paymentResponse.text();
            throw new Error(`Payment API Error: ${paymentResponse.statusText} - ${errorText}`);
        }

        const payment = await paymentResponse.json();


        const order = await OrderService.findById(orderId);
        if (!order) {
            return res.status(400).send({ message: "Order not found" });
        }

        // Convert to float for comparison
        const orderAmount = parseFloat(order.amount);
        const paymentAmount = parseFloat(payment.amount.total);


        if (orderAmount === paymentAmount) { // 금액을 숫자로 변환 후 비교
            switch (payment.status) {
                case "VIRTUAL_ACCOUNT_ISSUED":
                    return res.status(200).send({ message: "가상 계좌가 발급되었습니다." });
                case "PAID":
                    return res.status(201).send({ message: "결제가 완료되었습니다." });
                default:
                    return res.status(400).send({ message: "알 수 없는 결제 상태입니다." });
            }
        } else {
            return res.status(400).send({ message: "결제 금액 불일치" });
        }
    } catch (e) {
        console.error('결제 검증에 실패했습니다:', e.message);
        res.status(400).send({ error: e.message });
    }
});
