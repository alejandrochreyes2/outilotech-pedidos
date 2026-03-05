FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:3003
EXPOSE 3003


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PagosAPI.csproj", "."]
RUN dotnet restore "PagosAPI.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "PagosAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PagosAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PagosAPI.dll"]