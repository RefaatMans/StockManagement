using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yousefWeb.DAL;
using yousefWeb.Models.DTO;
using yousefWeb.Models;
using System.Globalization;

namespace yousefWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExchangeRateController : ControllerBase

    {
        private readonly MyAppContext _context;

        public ExchangeRateController(MyAppContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var latestRates = await _context.ExchangeRates
                    .GroupBy(rate => rate.CurrencyId)
                    .Select(group => group.OrderByDescending(rate => rate.Date).FirstOrDefault())
                    .ToListAsync();

                if (latestRates == null || latestRates.Count == 0)
                {
                    return NotFound("Data Not Found");
                }

                return Ok(latestRates);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("AddRate")]
        public async Task<IActionResult> Post(ExchangeRatedto model)
        {
            try
            {
                var rate = new ExchangeRate
                {
                    Rate = model.Rate,
                    CurrencyId = model.CurrencyId,
                    Date = DateTime.Now.Date,
                };

                await _context.ExchangeRates.AddAsync(rate);
                await _context.SaveChangesAsync();
                return Ok("Successfully");
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

