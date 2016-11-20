using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ScribesRFC.com.Controllers
{
    public class PagesController : Controller
    {
        // GET: Pages
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Dues()
        {
            return View();
        }

        public ActionResult Insurance()
        {
            return View();
        }

        public ActionResult Locations()
        {
            return View();
        }

        public ActionResult Sponsors()
        {
            return View();
        }

        public ActionResult Teams()
        {
            return View();
        }
    }
}