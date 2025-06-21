import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import HomePage from './pages/home';
import HomeEnPage from './pages/home-en';
import DocsPage from './pages/docs';
import DocsEnPage from './pages/docs-en';
import ProjectsPage from './pages/projects';
import ProjectsEnPage from './pages/projects-en';
import NotFoundPage from './pages/not-found';
import PromptToPodcastPage from "./pages/prompt-to-podcast";
import SubtitlesPage from "./pages/projects/subtitles";
import ModeratorPage from "./pages/projects/moderator";
import WeatherPage from "./pages/projects/weather";
import WikiPage from "./pages/projects/wiki";
import ImageGenPage from "./pages/projects/image-gen";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/home" component={HomePage} />
      <Route path="/home-en" component={HomeEnPage} />
      <Route path="/docs" component={DocsPage} />
      <Route path="/docs-en" component={DocsEnPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects-en" component={ProjectsEnPage} />
      <Route path="/projects/ptp" component={PromptToPodcastPage} />
      <Route path="/projects/subtitles" component={SubtitlesPage} />
      <Route path="/projects/moderator" component={ModeratorPage} />
      <Route path="/projects/weather" component={WeatherPage} />
      <Route path="/projects/wiki" component={WikiPage} />
      <Route path="/projects/image-gen" component={ImageGenPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;