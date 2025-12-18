# JOIN_NEXON

> 넥슨 Shared DB MSA-Like 이벤트 서버.

![](../header.png)

## 실행 방법

Docker:

```sh
docker-compose up --build
```

NotDocker:

```sh
cd gateway_nexon && npm install --force
cd ../auth_nexon && npm install --force
cd ../event_nexon && npm install --force
```

```sh
cd gateway_nexon && npm start
```

```sh
cd auth_nexon && npm start
```

```sh
cd event_nexon && npm start
```

<br/>
## 사용 예제

**권한 별 테스트용 유저**<br/>
**[admin]** { user_id : nexon , password : 987987 }<br/>
**[operator]** : { user_id : y11 , password : 0531 }<br/>
<br/>
**권한 종류**<br/>
USER : 실사용 유저 (default)[이벤트 참여 및 요청조회] <br/>
OPERATOR : 운영자 [이벤트관련 생성 및 수정 & 지급] <br/>
AUDITOR : 감사자 [유저 요청 리스트 확인] <br/>
ADMIN : 관리자 [모든 기능 사용 가능]<br/>
<br/>
**스웨거 경로** http://localhost:8001/ApiDocument#/

## 흐름정보

**이벤트 종류**<br/>
quiz : OX형 퀴즈 <br/>
rand : 문답형 퀴즈<br/>

**유저**<br/>
유저 가입(USER) > 등급 부여 <br/> <br/>

**이벤트 등록**<br/>
하위로 내려갈 수록 1:N<br/>
이벤트 등록 > 지급 조건 등록(quiz,rand) > 보상 정보 등록 > 아이템 등록

**이벤트 실행**<br/>
**유저** : 이벤트 리스트 조회 > 이벤트 실행 1차(문제 제시) <br/> 이벤트 실행 2차(답변[보상요청]) > 성공시 보상요청 조회<br/><br/>
**관리자** : 유저 보상 요청 조회 > 보상 지급 (보상지급은 이벤트 고유번호만 넣으면 일괄처리 됩니다.)

## 업데이트 내역

-   1 도커 호스트 오류 수정

## Stack

**[DB]** : MongoDB<br/>
**[Nodejs]** : v18.20.8<br/>
**[Nestjs]** : 10.3.2(Nodejs18의 최신)<br/>
**[Auth]** : JWT<br/>
**[Language]** : TypeStript<br/>
**[Etc]** : Docker & docker-compose

## \*\*부가 설명\*\*

<br/> 
- 최대한 관리자 혹은 운영자가 자유롭게 이벤트를 생성 및 수정 할 수 있게 고안하여 설계 및 작업하였습니다.<br/><br/>
- 수정 기능도 필요하실 경우 사용해주시면 됩니다.<br/><br/>
- 이벤트 별 지급 조건, 지급 조건 별 보상, 보상 별 아이템 각기 다르게 등록 할 수 있습니다.<br/><br/>
- enum 은 typeScript에서 tree shaking 을 지원하지 않아 사용하지 않았습니다.<br/><br/>
