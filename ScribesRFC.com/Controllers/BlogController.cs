using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ScribesRFC.com.Controllers
{
    public class BlogController : Controller
    {
        // GET: Blog
        public ActionResult ViewPost()
        {
            return View();
        }
    }
}