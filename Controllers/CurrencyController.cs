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
    public class CurrencyController : ControllerBase
    {
      
            private readonly MyAppContext _context;

            public CurrencyController(MyAppContext context)
            {
                _context = context;
            }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var currency = await _context.Currencies.ToListAsync();
                if (currency.Count == 0)
                {
                    return NotFound("Data Not Found");
                }
                return Ok(currency);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Currencydto dto)
        {
            try
            {
                var currency = await _context.Currencies.Where(c => c.CurrencyCode == dto.CurrencyCode).FirstOrDefaultAsync();
                if (currency != null)
                {
                    return BadRequest("Duplicate name");
                }

                var cat = new Currency {
                    CurrencyCode = dto.CurrencyCode,
                };
                await _context.Currencies.AddAsync(cat);
                await _context.SaveChangesAsync();
                return Ok("Category Added");
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var currency = await _context.Currencies.FindAsync(id);

                if (currency == null)
                {
                    return NotFound("Currency not found");
                }

                _context.Currencies.Remove(currency);
                await _context.SaveChangesAsync();

                return Ok("Currency deleted");
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
    }
