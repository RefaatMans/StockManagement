using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yousefWeb.DAL;
using yousefWeb.Models;
using yousefWeb.Models.DTO;

namespace yousefWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly MyAppContext _context;

        public ClientController(MyAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var clients = await _context.Clients.ToListAsync();
                if (clients.Count == 0)
                {
                    return NotFound("Data Not Found");
                }
                return Ok(clients);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("AddClient")]
        public async Task<IActionResult> Post(Clientdto model)
        {
            try
            {
                var client = new Client
                {
                   Name = model.Name,
                   phoneNb = model.phoneNb,
                   address = model.address,
                };

                await _context.Clients.AddAsync(client);
                await _context.SaveChangesAsync();
                return Ok();
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
