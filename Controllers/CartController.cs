using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yousefWeb.DAL;
using yousefWeb.Models.DTO;
using yousefWeb.Models;

namespace yousefWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly MyAppContext _context;

        public CartController(MyAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var cart = await _context.Carts.ToListAsync();
                if (cart.Count == 0)
                {
                    return NotFound("No carts");
                }
                return Ok(cart);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
        [HttpGet("GetByClientId")]
        public async Task<IActionResult> GetByClientId(int clientId)
        {
            try
            {
                var carts = await _context.Carts
                    .Where(cart => cart.ClientId == clientId)
                    .OrderByDescending(cart => cart.Id)
                    .ToListAsync();

                if (carts.Count == 0)
                {
                    return NotFound("No carts");
                }

                return Ok(carts);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var carts = await _context.Carts.Where(cart => cart.Id == id).ToListAsync();

                if (carts.Count == 0)
                {
                    return NotFound("No carts");
                }

                return Ok(carts);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getLastCart")]
        public async Task<IActionResult> get()
        {
            try
            {
                int highestId = await _context.Carts.MaxAsync(e => (int?)e.Id) ?? 0;

                return Ok(highestId);
            }
            catch (Exception e)
            {

                return BadRequest("error");
            }
        }
        [HttpPost("AddCart")]
        public async Task<IActionResult> Post(Cartdto cart)
        {
            try
            {
                var newCart= new Cart
                {
                    ClientId = cart.ClientId,
                    Total = cart.Total,
                    Date = DateTime.Now,
                };
                await _context.Carts.AddAsync(newCart);
                await _context.SaveChangesAsync();
                return Ok("Cart Successfully added.");
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
