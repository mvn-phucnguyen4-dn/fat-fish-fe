import React, { useContext } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Auth from './pages/Auth/Auth'
import Home from './pages/Home/Home'
import Notifications from './pages/Notifications/Notifications'
import MainNavigation from './components/MainNavigation/MainNavigation.js'
import Tag from './pages/Tag/Tag'
import Footer from './components/Footer/Footer'
import { AuthContext } from './context/auth'
import { BrowserRouter as Router } from 'react-router-dom'
import Topic from './pages/Topic/Topic'
import TopicReview from './pages/Review/TopicReview'
import EditTopic from './pages/EditTopic/EditTopic'
import ShowTopic from './components/middle/ShowTopic'
import ListScore from './pages/Topic/ListScore'
import AfterSubmitAnswer from './components/Topic/Result/AfterSubmitAnswer'
import ListTopic from './pages/ListTopic/ListTopic'
import MarkScore from './pages/MarkScore/MarkScore'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import UserAnswer from './pages/UserAnswer/UserAnswer'

const MainRouter = ({ token }) => {
  let routes
  const { isLoggedIn } = useContext(AuthContext)

  if (isLoggedIn) {
    routes = (
      <>
        <MainNavigation />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/topics" exact>
            <ShowTopic />
          </Route>
          <Route path="/users/topic" exact>
            <ListTopic />
          </Route>
          <Route path="/topic/:topicId" exact>
            <Topic />
          </Route>
          <Route path="/topics/:topicId/review" exact>
            <TopicReview />
          </Route>
          <Route path="/topic/:topicId/mark" exact>
            <MarkScore />
          </Route>
          <Route path="/users/:userId/notifications" exact>
            <Notifications />
          </Route>
          <Route path="/topics" exact>
            <ShowTopic />
          </Route>
          <Route path="/tags/:tagName" exact>
            <Tag />
          </Route>
          <Route path="/topics/:topicId/edit" exact>
            <EditTopic />
          </Route>
          <Route path="/topics/:id/scores" exact>
            <ListScore />
          </Route>
          <Route path="/result" exact>
            <AfterSubmitAnswer />
          </Route>
          <Route path="/topic/:topicId/user-answer" exact>
            <UserAnswer />
          </Route>
          <Redirect to="/auth" />
        </Switch>
        <Footer />
      </>
    )
  } else {
    routes = (
      <>
        <MainNavigation />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/auth" exact>
            <Auth newUser={false} />
          </Route>
          <Route path="/auth/new-user" exact>
            <Auth newUser={true} />
          </Route>
          <Route path="/update-password" exact>
            <ChangePassword />
          </Route>
          <Redirect to="/auth" />
        </Switch>
        <Footer />
      </>
    )
  }

  return <Router>{routes}</Router>
}

export default MainRouter
