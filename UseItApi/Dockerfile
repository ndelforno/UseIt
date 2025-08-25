# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["UseItApi.csproj", "./"]
RUN dotnet restore "./UseItApi.csproj"

# Copy everything else and publish
COPY . .
RUN dotnet publish "./UseItApi.csproj" -c Release -o /app/publish

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5062
COPY --from=build /app/publish .
EXPOSE 5062
ENTRYPOINT ["dotnet", "UseItApi.dll"]
