using Auto_Ecole.Outils;
using ECF_AEL.Metier;
using ECF_AEL.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<Connexion>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthMetier, AuthMetier>();
builder.Services.AddScoped<IEleveRepository, EleveRepository>();
builder.Services.AddScoped<IEleveMetier, EleveMetier>();
builder.Services.AddScoped<ILeconRepository, LeconRepository>();
builder.Services.AddScoped<ILeconMetier, LeconMetier>();
builder.Services.AddScoped<IMoniteurRepository, MoniteurRepository>();
builder.Services.AddScoped<IMoniteurMetier, MoniteurMetier>();
builder.Services.AddScoped<IModeleRepository, ModeleRepository>();
builder.Services.AddScoped<IModeleMetier, ModeleMetier>();
builder.Services.AddScoped<IVehiculeRepository, VehiculeRepository>();
builder.Services.AddScoped<IVehiculeMetier, VehiculeMetier>();
builder.Services.AddScoped<ICalendrierRepository, CalendrierRepository>();
builder.Services.AddScoped<ICalendrierMetier, CalendrierMetier>();
builder.Services.AddScoped<IEpreuveRepository, EpreuveRepository>();
builder.Services.AddScoped<IEpreuveMetier, EpreuveMetier>();
builder.Services.AddScoped<IStatsRepository, StatsRepository>();
builder.Services.AddScoped<IStatsMetier, StatsMetier>();

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
