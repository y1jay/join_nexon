# JOIN_NEXON

> 넥슨 코딩테스트 과제.

## 비고

<br/> 
enum 은 typeString에서 tree shaking 을 지원하지 않아 제외했습니다.<br/>
.env파일은 테스트에 편의를 위해 커밋해놓았습니다.<br/>
만일 도커 실행이 되지 않는다면 터미널 or 쉘 사용 부탁드립니다 ..

![](../header.png)

## 설치 방법

Docker:

```sh
docker-compose up --build
```

NotDocker:

```sh
cd gateway_nexon && npm install cd ../auth_nexon && npm install cd ../event_nexon && npm install
```

```sh
cd gateway_nexon && npm start cd auth_nexon && npm install cd event_nexon && npm install
```

## 사용 예제

**권한 별 유저**
admin : { user_id : nexon , password : 987987 }<br/>
operator : { user_id : y11 , password : 0531 }<br/>

스웨거 경로 http://localhost:8001/ApiDocument#/

## 흐름도

**유저**<br/>
유저 가입(USER) > 등급 부여

**이벤트 등록**<br/>
이벤트 등록 > 지급 조건 등록 > 보상 정보 등록 > 아이템 등록

**이벤트 실행**<br/>
유저 : 이벤트 리스트 조회 > 이벤트 실행 1차(문제 제출) <br/> 이벤트 실행 2차(답변) > 성공시 보상요청 조회<br/>
관리자 : 유저 보상 요청 조회 > 보상 지급 (보상지급은 이벤트 고유번호만 넣으면 일괄처리 됩니다.)

## 업데이트 내역

-   1

## Stack

[DB] : MongoDB
[Nodejs] : v18.20.8
[Auth] : JWT
[Language] : TypeStript
[Etc] : Docker & docker-compose
