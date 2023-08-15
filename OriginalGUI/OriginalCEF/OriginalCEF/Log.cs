using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.IO;

namespace OriginalCEF
{
    public static class Log
    {
        private static Mutex mut = new Mutex();
        static StreamWriter log = new StreamWriter("log.log", true);
        public static void WriteLog(string message)
        {
            mut.WaitOne();
            log.WriteLine(message);
            log.Flush();
            mut.ReleaseMutex();
    }
}
}
