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
    public class ScheduledAmountController : ControllerBase
    {
        private readonly MyAppContext _context;

        public ScheduledAmountController(MyAppContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> Get() {
            try
            {
                var items = await _context.ScheduledAmounts.ToListAsync();
                if (items.Count == 0)
                {
                    return NotFound("Data Not Found");
                }
                return Ok(items);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getByDate")]
        public async Task<IActionResult> GetByDate()
        {
            try
            {
                DateTime today = DateTime.Today;

                var items = await _context.ScheduledAmounts
                    .Where(i => i.Date.Date == today)
                    .ToListAsync();

                if (items.Count == 0)
                {
                    return NotFound("Data Not Found");
                }

                return Ok(items);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getAllDates")]
        public async Task<IActionResult> GetAllDates()
        {
            try
            {
                DateTime today = DateTime.Today;
                var items = await _context.ScheduledAmounts
                    .Where(i => i.Date.Month == today.Month)
                    .ToListAsync();
                if (items.Count == 0)
                {
                    return NotFound("Data Not Found");
                }
                return Ok(items);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPost("AddAmount")]
        public async Task<IActionResult> Post(ScheduledAmoutdto model)
        {
            try
            {
                // Check if there is an existing record with the same date (ignoring time)
                if (_context.ScheduledAmounts.Any(sa => sa.Date.Date == DateTime.Now.Date))
                {
                    return BadRequest("An item with the same date already exists.");
                }

                var newAmount = new ScheduledAmount
                {
                    Date = DateTime.Now,
                    Amount = model.Amount,
                };

                await _context.ScheduledAmounts.AddAsync(newAmount);
                await _context.SaveChangesAsync();
                return Ok("Successfully added.");
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


        [HttpPut("UpdateItemByDate")]
        public async Task<IActionResult> UpdateItemByDate([FromBody] ScheduledAmoutdto model)
        {
            try
            {
                var existingItem = await _context.ScheduledAmounts.FirstOrDefaultAsync(item => item.Date.Date == model.Date.Date);

                if (existingItem == null)
                {
                    return NotFound($"Item with date {model.Date} not found");
                }

                existingItem.Amount = model.Amount;

                _context.ScheduledAmounts.Update(existingItem);
                await _context.SaveChangesAsync();

                return Ok("Item updated successfully");
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
