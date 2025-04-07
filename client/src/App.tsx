import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Blogs from "@/pages/Blogs";
import BlogDetail from "@/pages/BlogDetail";
import WebStories from "@/pages/WebStories";
import WebStoryDetail from "@/pages/WebStoryDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blogs" component={Blogs} />
          <Route path="/blogs/:slug" component={BlogDetail} />
          <Route path="/webstories" component={WebStories} />
          <Route path="/webstories/:slug" component={WebStoryDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
