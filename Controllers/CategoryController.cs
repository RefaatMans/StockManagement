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
    public class CategoryController : ControllerBase
    {
        private readonly MyAppContext _context;

        public CategoryController(MyAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var categories = await _context.Categories.ToListAsync();
                if (categories.Count == 0)
                {
                    return NotFound("Data Not Found");
                }
                return Ok(categories);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost("AddCategory")]  
        public async Task<IActionResult> post(Categorydto dto)
        {

            try
            {
                var category = await _context.Categories.Where(c => c.Name == dto.Name).FirstOrDefaultAsync();
                if (category != null)
                {
                    return BadRequest("Duplicate name");
                }

                var cat = new Category { Name = dto.Name, };
                await _context.Categories.AddAsync(cat);
                await _context.SaveChangesAsync();
                return Ok("Category Added");
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpDelete]
        public async Task<IActionResult> delete(int id)
        {
            try
            {
                var item = await _context.Categories.FindAsync(id);
                if (item == null)
                {
                    return NotFound("Category not found");
                }
                _context.Categories.Remove(item);
                await _context.SaveChangesAsync();
                return Ok("Category deleted");
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}

