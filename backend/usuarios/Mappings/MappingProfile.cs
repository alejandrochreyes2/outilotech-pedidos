using AutoMapper;
using UsuariosAPI.Models;
using UsuariosAPI.DTOs;

namespace UsuariosAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ApplicationUser, UserResponseDto>()
                .ForMember(dest => dest.Token, opt => opt.Ignore());
            
            CreateMap<UserRegistrationDto, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
        }
    }
}
