http://jihoon-exercise.herokuapp.com/
(헤로쿠는 장기간 요청이 없으면 서버가 꺼지므로 url 클릭 후 10초가량 기다려야 접속 가능)
근데 왜 DB연결은 안되지..? 

# MERN 을 이용한 exercise- tracker

# 설명

아래 사진과 같이 운동기록을 남겨주는 서비스이다. 

express와 mongoDB를 활용하여 백엔드서버를 구축했고,

react를 사용하여 프론트엔드 페이지를 구현했다.

![Logged Exercise](https://user-images.githubusercontent.com/77804950/116409065-70f67100-a86e-11eb-82fd-a617394e72f6.png)

------



## 코드 설명

### DB연결

![mongodbCode](https://user-images.githubusercontent.com/77804950/116410002-540e6d80-a86f-11eb-86e6-8a806c127df1.png)

.env파일을 만들어 ATLAS_URI에 몽고DB에서 받은 code를 넣어준다. 

이 code가 express랑 mongodb를 연결해주는 api 키(?) 역할을 한다. 

```javascript
//server.js
const uri = process.env.ATLAS_URI;
mongoose.connect(uri , {useNewUrlParser:true ,useCreateIndex:true ,useUnifiedTopology: true });
const connection =mongoose.connection;
connection.once('open', () => {
    console.log("mongodb db connection established ");
})
```

### users 라우터

#### 1

```
// 1.
//user 목록 가져오는 요청  localhost:5000/users/
router.route('/').get((req,res) => {
    User.find()
        .then(users=> res.json(users)) 
        .catch(err=> res.status(400).json('ERROR: '+err));
});

```

위 코드는 localhost:5000/users/로 접속하면 실행되는데 ,

createExercise를 할 때 유저들을 DB에서 가져와 프론트엔드에 response를 보내준다.

![userlist](https://user-images.githubusercontent.com/77804950/116413480-9dac8780-a872-11eb-93bc-11d8178456f4.png)



```
componentDidMount() {
        axios
            .get('http://localhost:5000/users/')
            .then(res => {
                if (res.data.length > 0) { //적어도 1명 이상 유저있는경우
                    this.setState({
                        users: res
                            .data
                            .map(user => user.username), //user의 username을 배열로 만든것을 return 해주는게 map
                        username: res
                            .data[0]
                            .username
                    })
                }
            })
    }
```

노드로부터 받은 response를 setState에 담아서 프론트엔드에서 사용할 수 있게 한다.

------



#### 2

```
//(리액트) create-user.component.js
onSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username
        }
        console.log(user);
        axios
            .post('http://localhost:5000/users/add', user)
            .then(res => {
                console.log(res.data())

            })
            .catch(err => console.error(err));
        this.setState({username: ''})
        //
        window.location = '/'; // list hp로 되돌리기.
    }
```

createUser할 때 input태그에서 사용자로부터 받은 username을 리액트 state에 저장한 뒤 state를 body에 실어서 localhost:5000/users/add 에 보내준다

그럼 아래 코드를 통해 DB에 저장하게 된다. 

```
// 2.
// 유저 정보 DB에 넣는 POST요청  localhost:5000/users/add
router.route('/add').post((req,res)=> {
    const username =req.body.username;
    const newUser =new User ({username});
    newUser.save()
        .then(()=> res.json('user added'))
        .catch((err)=> res.status(400).json('ERROR: '+err));
})
```

------



### Exercise 라우터 

#### 1

```javascript
router.get('/', (req,res) => {
    Exercise.find()
        .then(Exercises=> res.json(Exercises)) 
        .catch(err=> res.status(400).json('ERROR: '+err));

});
```

DB에 있는 Exercise 정보들을 프론트엔드로 넘겨주는 백엔드 코드다.

```
 componentDidMount() {
        axios
            .get('http://localhost:5000/exercises/')
            .then(res => {
                if (res.data.length > 0) { //운동이 1개라도 있다면
                    this.setState({exercises: res.data}) //exercises 배열에 response받은거 넣기.
                }
            })
            .catch(err => console.error(err))

        }
```

state에 exercises라는 배열이 있다. 

exercises에 백엔드로부터 받은 정보들을 넣는다.

```
//exercise-list.component.js
const Exercise = props => {
    return (
        <tr>
            <td>{props.exercise.username}</td>
            <td>{props.exercise.description}</td>
            <td>{props.exercise.duration}</td>
            <td>{
                    props.exercise.date.substring(0, 10)
                }</td>
            <td>
                <Link to={'/edit/' + props.exercise._id}>edit</Link>
                |
                <a href="#" onClick={() => {
                        props.deleteExercise(props.exercise._id)
                    }}>delete</a>
            </td>
        </tr>

    );

};
exerciseList() { 
        return this.state.exercises.map(exercise => {
                return <Exercise // <- 각 exercise 마다 Exercise component 만들기
                    exercise={exercise}
                    deleteExercise={this.deleteExercise}
                    key={exercise._id}/>; //deleteExercise는 함수인데 함수도 넘겨줄 수 있음.
            })
    }
 render(){
     return{
     ....
     {this.exerciseList()} // <- exerciseList 함수 실행
     ....
     }
 }
```

렌더링 할 때 exerciseList함수를 만들어 실행시키고 ,

그 함수에서 exercises배열에 있는 exercise마다 Exercise 컴퍼넌트에 props로 넘겨준다.

참고로 한 파일에 한 컴퍼넌트를 만드는게 좋은 습관이라고 하지만 Exercise 컴퍼넌트 같은 경우 간단한 컴퍼넌트라서 한 파일에 두 개의 컴퍼넌트를 넣을 수 있다. 

------



#### 2 

리액트에서 createExercise를 할 때 값을 넣고 create 버튼을 누르면 ,

```
    onSubmit(e) {
        e.preventDefault();
        const exercise = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }
        console.log(exercise);
        axios
            .post('http://localhost:5000/exercises/add', exercise)
            .then(res => console.log(res.data()))
            .catch(err => console.error(err));
        window.location = '/'; // list hp로 되돌리기.
    }
```

exercise 객체를 만들어 state에 있는 값들을 넣어주고 이 객체를 백엔드에 보내게 된다

```
router.route('/add').post((req,res)=> {
    const username =req.body.username;
    const description=req.body.description;
    const duration=Number(req.body.duration);
    const date= Date.parse(req.body.date);
    const newExercise= new Exercise({username ,description , duration ,date});
    newExercise.save()
        .then(()=> res.json('Exercise added'))
        .catch((err)=> res.status(400).json('ERROR: '+err));
})
```

백엔드에서는 req에 있는 body값들을 받아서 db에 저장하는 코드를 작성하였다. 

#### 3

특정 exercise의 edit 버튼을 클릭했을 때 해당 exercise의 값을 가져온다.

```
//edit-exercise.component.js
        axios
            .get('http://localhost:5000/exercises/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    username: res.data.username,
                    description: res.data.description,
                    duration: res.data.duration,
                    date: new Date(res.data.date)

                })

            })
            .catch(err => console.error(err))

        }
```

프론트엔드에서 백엔드로 요청하는 코드다.

```
router.route('/:id').get((req,res)=> {
    Exercise.findById(req.params.id)
        .then((exercise)=> res.json(exercise))
        .catch((err)=> res.status(400).json('ERROR: '+err));
})
```

get요청을 받으면 해당id 로 값들을 찾고, 프론트엔드로 돌려주는 코드다. 

이 프론트엔드 값으로 수정을 하고싶은 exercise 값을 가져오게 된다 .

```
onSubmit(e) {
        e.preventDefault();
        const exercise = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }
        console.log(exercise);
        axios
            .post(
                'http://localhost:5000/exercises/update/' + this.props.match.params.id,
                exercise
            )
            .then(res => console.log(res.data()))
            .catch(err => console.error(err));
        window.location = '/'; // list hp로 되돌리기.
    }
```

만약 edit 버튼을 눌러서 수정을 완료하면 onSubmit 함수를 통해 백엔드로 수정된 정보를 보내준다

exercise 객체에 값들을 담아서 백엔드에 보내게 되면 , 

```
router.route('/update/:id').post((req,res)=>{
    Exercise.findById(req.params.id)
    .then(exercise=> {
        exercise.username=req.body.username;
        exercise.description= req.body.description;
        exercise.duration= req.body.duration;
        exercise.date= Date.parse(req.body.date);
        exercise.save()
        .then(()=> res.json('Exercise deleted'))
        .catch((err)=> res.status(400).json('ERROR: '+err));
    })
    .catch((err)=> res.status(400).json('Error: '+ err));

})
```

req에 있는 id를 통해 어떤 exercise인지 찾고, 값을 수정해 저장하는 백엔드 코드이다. 

#### 4

특정 exercise를 지우고 싶을 때 사용되는 코드들이다. 

```
deleteExercise(id) {
        axios.delete('http://localhost:5000/exercises/' + id)
        .then(res => console.log(res.data))
        .catch(err => console.error(err));
        this.setState({
            exercises: this.state.exercises.filter(el => el._id !== id) //_id : objectId , _id!==id일 경우 배제 시키고 배열 만듬. 
        })
    }
```

ExerciseList 컴퍼넌트에 들어있는 함수 deleteExercise를 통해 삭제요청을 백엔드로 보내게된다. 

filter는 for문처럼 각 요소들을 참조하여 이하 조건에 해당하는 값들로만 배열을 새로 만든다 .

위 코드에서는 _id와 해당 id가 같으면 삭제해야 하는 값이므로 배열에 포함하지 않는다. 

여기서 _id 값은 objectId로 자동으로 mongodb에서 만들어준다. 

```
router.route('/:id').delete((req,res)=> {
    Exercise.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Exercise deleted'))
        .catch(err=> res.status(400).json('Error: '+err));

})
```



## [기타 배운점] 

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

## 

리액트 port는 3000, 노드 port는 5000으로 해서 개발을 하고 있었는데

포론트엔드에서 axios를 이용해 user를 추가하는 post요청을 보내면 자꾸 안되는 현상이 발생했다

![제목 없음](C:\Users\hoonveloper\Desktop\제목 없음.png)

구글링을 해보니 cors 문제라고 해서 

cors를 설치하고 server.js에 넣어줬는데도 해결이 안되서

결국 선규한테 도움을 받았다

> 선규: "F.E와 B.E 포트가 같으면 상관 없지만 만약 포트가 다를 경우 B.E api에 다른사람들이 쉽게 접근할 수 있어서 보안상 차단된거임 "

근데 왜 CORS를 서버코드에 넣어줬는데도 해결이 되지 않았냐? 

```
app.use('/exercises', exerciseRouter);
app.use('/users',userRouter);
app.use(cors());
//<------이상 이전 코드 ------>
app.use(cors());
app.use('/exercises', exerciseRouter);
app.use('/users',userRouter);
```

위 코드와 같이 순서 문제였다.

라우터를 사용하고 CORS를 넣어주면 이미 사용되서 늦었고

라우터를 서버에 장착하기 전에 cors를 넣어주어야 했다!

------

### functional component / class component

클래스 컴퍼넌트는 state와 lifecycle( componentDitMount 등 ) 이 존재한다 . 따라서 렌더링 되기 전 ,후에 특정 작업을 실행하기 용이한데 ,

함수형 컴퍼넌트는 state와 lifecycle이 존재하지 않는다

물론 reacthook을 사용하면 해결이 가능하긴 하다. 
