// import "@/assets/css/bootstrap-tcl.css"
// import "@/assets/css/main.css"

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ACCESS_TOKEN } from '@/constants'
import menuService from '@/services/menu'
import userService from '@/services/user'
import type { AppContext, AppProps } from 'next/app'
import Head from 'next/head'
import { getTokenSSRAndCSS, mappingMenuData } from "../helper";
import { useEffect, useMemo } from 'react'
import { useGlobalState } from '@/state'
import Cookies from 'js-cookie'
import App from 'next/app'
import categoryService from '@/services/category'
import { CategoryType } from '@/helper/formatApi'

export default function MyApp({ Component, pageProps }: AppProps) {

  const [token, setToken] = useGlobalState("token");
  const [currentUser, setCurrentUser] = useGlobalState("currentUser");

  const setCategories = useGlobalState("categories")[1];

  const { menus, categoryList } = pageProps;
  useMemo(() => {
    setToken(pageProps.token);
  }, []);

  useEffect(() => {
    //optimize category
    const optimizedCategories: { [key: string]: CategoryType } = {};
    let i = 0;
    const count = categoryList.length;
    for (i = 0; i < count; i++) {
      const category = categoryList[i];
      optimizedCategories[category.id] = category;
    }
    setCategories(optimizedCategories);
  }, []);

  const tokenFetchMe = Cookies.get('token') as string;

  useEffect(()=>{
    if(tokenFetchMe){
       userService.fetchMe(tokenFetchMe).then(user => {
        if (user.data.id){
          setCurrentUser(user.data);
        } 
        console.log("user.data", user.data)
      })
    } else if(tokenFetchMe === null) {
      console.log("hole", user.data)
      Cookies.remove('token')
    
    }
    
  }, [tokenFetchMe])

  return (
  <>
    <Head>
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Next Blog</title>
    </Head>
    
    <div className="wrapper-content">
      <Header menus={menus}/>
      <Component {...pageProps} />
      <div className="spacing" />
      <Footer/>
    </div>
    
  </>)
}

MyApp.getInitialProps = async (appContext: AppContext ) => {

  const appProps = await App.getInitialProps(appContext);

  const [token, userToken] = getTokenSSRAndCSS(appContext.ctx);

  const menuList = [];
  const categoryList = [];
  if (typeof window === "undefined") {
    const menuPromise = menuService.getAll({});
    const categoryPromise = categoryService.getCategories();
    const [ menuResponse, categoryResponse ] = await Promise.all([menuPromise, categoryPromise].map((p) => p.catch((e) => e)));
    menuList.push(...menuResponse.data.items);
    categoryList.push(...categoryResponse.data.map((e: any) => (e)));
    // const menus = response.data.items.map(mappingMenuData);
  }
  return {
    pageProps: {
        ...appProps.pageProps,
        token,
        menus: menuList || [],
        categoryList,
      }
  }
}