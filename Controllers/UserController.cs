using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using yousefWeb.DAL;
using yousefWeb.Models.DTO;
using yousefWeb.Models;
using Microsoft.EntityFrameworkCore;

namespace yousefWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MyAppContext _context;

        public UserController(MyAppContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Post(Userdto dto)
        {
            try
            {

                var user = await _context.Users.Where(c => c.Name == dto.Name).FirstOrDefaultAsync();
                if (user != null)
                {
                    var pass = await _context.Users.Where(c => c.Password == dto.Password).FirstOrDefaultAsync();
                    if (pass != null)
                    {
                        return Ok("LoggedIn");
                    }
                }
                return BadRequest("wrong!!");
            }
            catch (Exception e)
            {
                while (e.InnerException != null)
                {
                    e = e.InnerException;
                }

                return BadRequest(e.Message);
            }
        }
    }
}
