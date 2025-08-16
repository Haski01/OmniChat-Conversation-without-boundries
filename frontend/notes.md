## setup frontend

- npm create vite@latest . : // (.) is tells download in frontend find only or current file only
- clean up code
- setup tailwindcss with vite
- setup daisyUI plugin : npm i -D daisyui@4.12.24

```
daisyUI is the Tailwind CSS plugin you will love!
It provides useful component class names
to help you write less code and build faster.
```

- setUp pages using "react-router" :-

  - (doc)[https://reactrouter.com/start/modes#declarative]

- setUpa react-hot-tost: npm package for popup notification like error, success, loading

  - [doc-link](https://react-hot-toast.com)

### `tanstack query setup` - TanStack Query Handles server data fetching, caching, and synchronization in React apps, replacing the need for manual useEffect and fetch() logic.

- (doc)[https://tanstack.com/query/latest/docs/framework/react/installation]
- Without TanStack Query, fetching API data requires multiple useState hooks for loading, error, and data, plus useEffect for the request — making the code longer and repetitive. TanStack Query simplifies this into a single, declarative hook.

- without using tanstack query..

```jsx
/*
 const [data, setData] = useState([]);
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
   const getData = async () => {
     setIsLoading(true);
     try {
       const res = await fetch("https://jsonplaceholder.typicode.com/todos");
       const data = await res.json();
       setData(data);
     } catch (error) {
       setError(error);
     } finally {
       setIsLoading(false);
     }
   };
   getData();
 }, []);

 console.log(data);
 */
```

#### TanStack Query Setup Notes

1. Install:

```bash
npm install @tanstack/react-query
```

2. create query client

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>;
```

3. Query (GET request – read data): (query is use to get data)

```jsx
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ["todos"],
  queryFn: async () =>{
    const res =  await fetch("://jsonplaceholder.typicode.com/todos");
    const data = await res.json()
    return data
  }
    // update with axios (another fetch api method)
    queryFn: async() => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos")
    return res.data
    }
});
```

`Note`: Use when: You want to fetch or read data from the server

- Summary to setup tanstack:

  - instalation
  - create query client
  - Query → Reading data (GET).
  - Mutation → Writing/changing data (POST, PUT, DELETE).
    https

- storySet for images: [image link](https://storyset.com/search?q=video%20call)
- lucide-react for icons: [doc](https://lucide.dev/guide/packages/lucide-react)

- build signupPage ui
- build onboardingPage ui
- build loginPage ui

- build layout (navbar and sidebar) for homePage and notification page..
  - build layout and wrap homePage and notification page and other components with layout in app.jsx
