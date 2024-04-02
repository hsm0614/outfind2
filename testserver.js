const express = require("express");
const session = require('express-session'); // express-session 모듈 추가
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const uuid = require('uuid').v4; // uuid 패키지를 사용하여 고유한 세션 ID 생성

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
  host: '127.0.0.1', // MySQL 호스트 주소
  user: 'root', // MySQL 사용자 이름
  password: 'tjdals0912!', // MySQL 비밀번호
  database: 'outfind' // 사용할 데이터베이스 이름
});

// MySQL 서버 연결
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// 연결 종료
// connection.end();

// 정적 파일 미들웨어 설정
app.use(express.static(path.join(__dirname, 'no2outfind', 'image')));
app.use(express.static(path.join(__dirname, 'no2outfind')));
// 서버 포트 설정
const PORT = process.env.PORT || 3000;

// 서버 시작
app.listen(PORT, function(){
    console.log("App is running on port " + PORT);
});

// 루트 경로에 대한 요청 처리
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "maintpage.html")); // 절대 경로를 사용하여 파일 보내기
});

app.get("/mainpage.css", function(req, res){
    res.sendFile(path.join(__dirname, "mainpage.css"));
});

// 회원가입 패이지
app.get("/signuppage/signup.html", function(req, res){
    res.sendFile(path.join(__dirname, "signuppage", "signup.html"));
});
app.get("/signuppage/singup.css", function(req, res){
    res.sendFile(path.join(__dirname, "signuppage", "singup.css"));
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



// testserver.js 파일 제공
app.get("/testserver.js", function(req, res){
    res.sendFile(path.join(__dirname, "testserver.js"), {
        headers: {
            'Content-Type': 'text/javascript' // MIME 타입을 'text/javascript'로 설정
        }
    });
});



// body-parser 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 기업 회원가입 요청 처리
app.post('/signup/company', (req, res) => {
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
    console.log('MySQL 데이터베이스에 회원 정보가 성공적으로 삽입되었습니다.');
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
app.post('/signup/contractor', (req, res) => {
    // 클라이언트에서 전송된 데이터 받아오기
    const { businessNumber, email, password, industry, subIndustry, location, contractorintroduction } = req.body;

    // 여기서 받아온 데이터를 사용하여 회원 가입 처리
    // 예시로 MySQL 데이터베이스에 새로운 회원 정보를 추가하는 코드를 작성합니다.
    // 실제로는 데이터베이스 연결 및 쿼리 작성이 필요합니다.

    // 새로운 회원 정보를 MySQL 데이터베이스에 추가하는 쿼리 실행
    const sql = `INSERT INTO contractors (business_number, email, password, industry, sub_industry, location, introduction) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [businessNumber, email, password, industry, subIndustry, location, contractorintroduction], (error, results, fields) => {
        if (error) {
            console.error('MySQL 데이터베이스에 회원 정보 삽입 중 오류 발생:', error);
            res.status(500).send('회원가입 중 오류가 발생했습니다.');
            return;
        }
        console.log('MySQL 데이터베이스에 회원 정보가 성공적으로 삽입되었습니다.');
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

// 로그인 처리
app.post("/login/company", function(req, res) {
    // 로그인 폼에서 전송된 데이터 받아오기
    const { companyEmail, companyPassword } = req.body;

    // MySQL 데이터베이스에서 해당 이메일을 가진 사용자를 찾음
    const query = `SELECT * FROM company WHERE email = ? AND password = ?`;
    connection.query(query, [companyEmail, companyPassword], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('로그인 중 오류가 발생했습니다.');
            return;
        }

        if (results.length > 0) {
            // 로그인 성공 시 세션에 사용자 정보 저장
            req.session.user = results[0]; // 여기서는 첫 번째 결과만 사용 (단일 사용자)
            const token = jwt.sign({ userId: results[0].id }, secretKey);
            const companyName = results[0].name; // 회사명을 가져와 변수에 저장
                // 토큰을 클라이언트에게 반환
                res.json({ companyEmail: companyEmail, token: token, userType: 'company'});

        } else {
            res.status(401).send("이메일 또는 비밀번호가 올바르지 않습니다."); // 로그인 실패 시 실패 메시지를 클라이언트로 보냄
        }
    });
});

// 인력도급 로그인 처리
app.post("/login/contractor", function(req, res) {
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

// body-parser 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 토큰 검증 함수
function verifyToken(token) {
    // 토큰 검증 로직 구현
}

// 예시: 보호되는 페이지 요청 처리
app.get('/protected', function(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        // 사용자 인증 성공
        res.send('Authenticated');
    } catch (error) {
        // 사용자 인증 실패
        res.status(401).send('Unauthorized');
    }
});

const jwt = require('jsonwebtoken');

// 사용자 정보
const user = {
  id: 1,
  username: 'example_user'
};

// 비밀키 (토큰을 서명할 때 사용됨)
const secretKey = 'my_secret_key';

// 로그인 요청 처리
app.post("/login", function(req, res) {
    // 사용자 인증 및 정보 가져오는 로직 수행

    // 예시로 사용자 인증 성공 후 토큰 생성
    const token = jwt.sign(user, secretKey);
    const userType = req.body.userType;

    
    // 토큰을 클라이언트에게 반환
    res.json({ token: token, userType: userType });
});

app.post('/submit-company-info', (req, res) => {
    const { name, email, phone, project_name, industry, location, number_of_people } = req.body;
  
    const sql = 'INSERT INTO modal (name, email, phone, project_name, industry, location, number_of_people) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [name, email, phone, project_name, industry, location, number_of_people], (err, result) => {
      if (err) {
        console.error('Error inserting company info: ', err);
        res.status(500).json({ error: 'Error inserting company info' });
        return;
      }
      console.log('Company info inserted');
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
    const selectedCompanies = [];
    const totalCompanies = companies.length;

    // 요청된 개수가 배열의 길이보다 큰 경우 배열의 길이를 사용
    const selectedCount = Math.min(count, totalCompanies);

    // 배열을 복제하여 셔플
    const shuffledCompanies = companies.slice().sort(() => Math.random() - 0.5);

    // 매칭된 개수만큼 선택
    for (let i = 0; i < selectedCount; i++) {
        selectedCompanies.push(shuffledCompanies[i]);
    }

    return selectedCompanies;
}


// 클라이언트로부터 매칭 요청을 받는 엔드포인트 설정
app.post('/submit-matching-request', (req, res) => {
    console.log(req.body); // 받은 데이터를 콘솔에 출력하여 확인
    const companyEmail = req.body.companyEmail;
    const contractorEmail = req.body.contractorEmail; // 인력도급업체의 이메일 정보를 받아옴
    const status = req.body.status;

    const sql = 'INSERT INTO matching (company_email, contractor_email, status) VALUES (?, ?, ?)';
    connection.query(sql, [companyEmail, contractorEmail, status], (err, result) => {
        if (err) {
            console.error('Error saving matching request to database:', err);
            res.status(500).json({ error: 'Error saving matching request to database' });
            return;
        }
        // 매칭 정보가 성공적으로 저장되면 응답을 보냄
        res.json({ success: true, message: '매칭 요청이 성공적으로 처리되었습니다.' });
    });
});

// 매칭 상태 조회 엔드포인트
app.get('/get-matching-status', (req, res) => {
    // MySQL에서 매칭 상태 가져오기
    connection.query('SELECT * FROM matching', (err, results) => {
        if (err) {
            console.error('매칭 상태 조회 실패:', err);
            res.status(500).json({ error: '매칭 상태 조회 실패' });
            return;
        }
        console.log('매칭 상태 조회 성공:', results);
        res.json({ matchingStatusList: results });
    });
});


// 매칭 정보 확인 엔드포인트 설정
app.post('/check-matching', (req, res) => {
    const contractorEmail = req.body.contractorEmail;

    // 아웃소싱 업체의 매칭된 기업 정보 및 프로젝트 이름 조회하는 쿼리 작성
    const query = `
    SELECT m.company_email, c.project_name, c.industry, c.number_of_people, c.phone
    FROM matching m 
    INNER JOIN modal c ON m.company_email = c.email 
    WHERE m.contractor_email = ?
    `;
     
    // 쿼리 실행
    connection.query(query, [contractorEmail], (err, results) => {
        if (err) {
            console.error('매칭 정보 조회 중 오류:', err);
            res.status(500).json({ error: '매칭 정보 조회 중 오류가 발생했습니다.' });
            return;
        }

        // 매칭된 기업 정보와 프로젝트 이름을 클라이언트에 반환
        res.json({ matchingCompanies: results });
    });
});



// 매칭 수락 요청 처리
app.post('/accept-match', (req, res) => {
    const contractorEmail = req.body.contractorEmail;
    const companyEmail = req.body.companyEmail;

    // 매칭 수락 처리 로직
    // 여기서는 단순히 성공을 응답으로 보냄
    res.status(200).json({ message: '매칭이 성공적으로 수락되었습니다.' });
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
        console.log('Matching data deleted successfully');
        res.json({ success: true, message: 'Matching data deleted successfully' });
    });
});
