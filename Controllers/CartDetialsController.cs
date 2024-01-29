using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yousefWeb.DAL;
using yousefWeb.Models;
using yousefWeb.Models.DTO;

namespace yousefWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartDetialsController : ControllerBase
    {
        private readonly MyAppContext _context;

        public CartDetialsController(MyAppContext context)
        {
            _context = context;
        }
        [HttpGet("GetByCartId")]
        public async Task<IActionResult> Get(int id)
        {
            var cartDetails = await _context.CartDetails.Where(c => c.CartId == id).ToListAsync();
            if (cartDetails.Count == 0) {
            return NotFound("No CartDetails");
            }
            return Ok(cartDetails);
        }
        [HttpPost]
        public async Task<IActionResult> Post(CartDetailsdto dto)
        {
            try
            {
                var cartDetails = new CartDetails
                {
                    CartId = dto.CartId,
                    ItemId = dto.ItemId,
                    UnitPrice = dto.UnitPrice,
                    Qty = dto.Qty,
                };
                await _context.AddAsync(cartDetails);
                await _context.SaveChangesAsync();
                return Ok("Added successfully");
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
    }
}
