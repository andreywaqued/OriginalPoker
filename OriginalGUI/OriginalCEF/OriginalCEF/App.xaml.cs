using CefSharp.Wpf;
using CefSharp;
using System;
using System.IO;
using System.Windows;

namespace CefSharp.OriginalCEF
{
    public partial class App : Application
    {
        public App()
        {
#if !NETCOREAPP
            var settings = new CefSettings()
            {
                //By default CefSharp will use an in-memory cache, you need to specify a Cache Folder to persist data
                CachePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "CefSharp\\Cache")
                
            };
            settings.RegisterScheme(new CefCustomScheme
            {
                SchemeName = "localfolder",
                DomainName = "cefsharp",
                SchemeHandlerFactory = new CefSharp.SchemeHandler.FolderSchemeHandlerFactory(
                    rootFolder: @"HTML Original",
                    defaultPage: "loading.html" // will default to index.html
                )
            });

            //Example of setting a command line argument
            //Enables WebRTC
            settings.BrowserSubprocessPath = System.IO.Path.GetFullPath(@"x86\CefSharp.BrowserSubprocess.exe");
            settings.CefCommandLineArgs.Add("enable-media-stream", "1");
            settings.UserAgent = "Original";

            //Perform dependency check to make sure all relevant resources are in our output directory.
            Cef.Initialize(settings, performDependencyCheck: true, browserProcessHandler: null);
#endif
        }
        
    }
    
}
