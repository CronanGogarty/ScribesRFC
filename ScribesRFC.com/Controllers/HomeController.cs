using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ScribesRFC.com.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            ViewBag.Title = "Scribes Rugby";
            ViewBag.NavHome = "class=active";
            return View();
        }        

        public ActionResult JoinScribes()
        {
            ViewBag.NavJoin = "class=active";
            return View();
        }

        public ActionResult LatestNews()
        {
            ViewBag.NavNews = "class=active";
            return View();
        }

        public ActionResult MensRugby(){
            ViewBag.NavMens = "class=active";
            return View();
        }


        public ActionResult WomensRugby()
        {
            ViewBag.NavWomens = "class=active";
            return View();
        }

        public ActionResult MinisRugby()
        {
            ViewBag.NavMinis = "class=active";
            return View();
        }

        public ActionResult TagRugby()
        {
            ViewBag.NavTag = "class=active";
            return View();
        }
    }
}