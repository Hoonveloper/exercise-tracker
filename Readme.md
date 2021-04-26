

# MERN 을 이용한 exercise- tracker

2021-04-20 express와 mongodb연결 , crud api 구현 완료

리액트로 fe만들기.



## Backend -express

localhost:5000/users/add 로 username을 넣어주고 post 하면



![image-20210420234954993](https://user-images.githubusercontent.com/77804950/115434974-5277f080-a244-11eb-85e7-dc8ce8b44426.png)

client는 위와 같은 response를 받는다.

post된 user는 mongoDB collection에도 등록되어 있는 것을 확인할 수 있다.

 

![image-20210420234919102](https://user-images.githubusercontent.com/77804950/115434990-56a40e00-a244-11eb-8824-c9155da043b1.png)

## Frontend -React

### Binding(바인딩)

#### 자바스크립트 바인딩

자바스크립트에서 바인딩을 먼저 이해해보자

```javascript
var ob= {
	props:'hello'
	sayhello : function () {
		console.log(this.props);
	}
}
ob.sayhello(); // 'hello' 출력
```

자바스클비트에서 객체 안의 메서드에서 this는 그 메서드가 포함된 객체를 의미한다.

따라서 위 코드에서는 ob라는 객체를 가리킨다.

```
var ref = ob.sayhello;
ref(); // undefined
```

이렇게 객체 메서드만을 전달시켜서 메서드를 실행시키면

hello가 아닌 undefined 가 출력되는데

그 이유는 ref에 담길 때 ob객체와의 관계가 상실되기 때문이다. 

따라서 **bind** 를 이용해 obj와의 관계를 알려주어 this가 가리키는 객체가

누구인지를 알려주면 된다. 

```
var ref= ob.sayhello.bind(obj)
ref(); //'hello'
```

#### 리액트 바인딩

리액트에서 바인딩을 하는 방법 중 가장 많이 하는 방법은

생성자 (Constructor)에 bind를 넣어서

onClick 을 통해 this.update 가 실행되면 this가 App을 가리킨다는 것을 

알려주게 된다 .

```javascript
class App extends React.Component {
    constructor() {
        super();
        this.state = {
              hidden: false,
        };
        this.update = this.update.bind(this);
    }
    update() {
        this.setState({
            hidden: true
        });
    }
    render() {
        return <div
            onClick={ this.update }
        />;
    }
}

출처: https://jeong-pro.tistory.com/79 [기본기를 쌓는 정아마추어 코딩블로그]
```

npm i react-datepicker
