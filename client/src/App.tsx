import { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "store/user";
import Navigation from "components/Navigation/Navigation";
import AppBackground from "components/AppBackground/AppBackground";
import AppSnackbar from "components/AppSnackbar/AppSnackbar";

// Pages
import Home from "pages/Home/Home";
import Login from "pages/Login/Login";
import Register from "pages/Register/Register";
import Server from "pages/Server/Server";
import AddServer from "pages/AddServer/AddServer";

const App = () => {
  const dispatch = useDispatch();
  const snackBars = useSelector((state) => state.ui.snackbars);

  useEffect(() => {
    dispatch(updateUser());
  }, [dispatch]);

  return (
    <>
      <AppBackground />
      <div className="app">
        <Navigation />
        <section className="app-page">
          <main className="main-content">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Route
                path="/servers"
                render={(props) => (
                  <Switch>
                    <Route path={`${props.match.path}/add`} exact component={AddServer} />
                    <Route
                      path={`${props.match.path}/:serverSlug`}
                      render={(props) => (
                        <Switch>
                          <Route path={`${props.match.path}/`} exact component={Server} />
                        </Switch>
                      )}
                    />
                  </Switch>
                )}
              />
            </Switch>
          </main>
        </section>
        {snackBars.list.map((snackbar) => (
          <AppSnackbar key={snackbar.id} snackbar={snackbar} />
        ))}
      </div>
    </>
  );
};

export default App;
