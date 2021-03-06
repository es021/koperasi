console.log("environment - " + process.env.NODE_ENV);
var isProd = (process.env.NODE_ENV === "production"); // that is deployed to server
var isProdLocal = (process.env.NODE_ENV === "production-local"); // build for local server
const SocketUrl = (isProd) ? `https://seedsjobfair.com/socket` : "http://localhost:6000";

const RootPath = (isProd) ? "/cf" : "";

var SiteUrl = (isProd) ? `https://seedsjobfair.com/cf` : "http://localhost:4000";
var AssetUrl = (isProd) ? `https://seedsjobfair.com/public` : SiteUrl;
var UploadUrl = AssetUrl + "/upload";
var StaticUrl = AssetUrl + "/static";
var ImageUrl = AssetUrl + "/asset/image";

var RootUrl = (process.env.NODE_ENV === "development-wp") ? "http://localhost" : "http://localhost:88";
if (isProd) {
    RootUrl = `https://seedsjobfair.com`;
}

var LandingUrl = `https://seedsjobfair.com`;

var PHPApi = (isProd) ? `https://seedsjobfair.com/php-api/` : RootUrl + `/cf-app/server/php-api/`;
var WPAjaxApi = (isProd) ? "https://seedsjobfair.com/career-fair/wp-admin/admin-ajax.php" : RootUrl + "/career-fair/wp-admin/admin-ajax.php";

const AppConfig = {
    Name: `1Koperasi Dashboard`,
    Desc: "Kami Meringankan Masalah Kewangan Anda",
    Url: (isProd || isProdLocal) ? PHPApi : "http://localhost:8080",
    Api: SiteUrl,
    PHPApi: PHPApi,
    FbAppId: "315194262317447",
    WPAjaxApi: WPAjaxApi,
    FbUrl: "https://www.fb.com/",
    WwwUrl: "http://www.1koperasi.com.my"
};


const ImgConfig = {
    AppIcon: AssetUrl + "/asset/image/icon-transparent.png",
    IsIcon: AssetUrl + "/asset/image/innovaseed.png",
    IsIconInverse: AssetUrl + "/asset/image/innovaseed_inverse.png",
    DefUser: AssetUrl + "/asset/image/default-user.png",
    DefCompany: AssetUrl + "/asset/image/default-company.jpg",
    getFlag: (country, size) => AssetUrl + `/asset/image/flags/${size}/${country}.png`, // www.icondrawer.com -- flag
    getBanner: (filename) => AssetUrl + `/asset/image/banner/${filename}`
};

//email like '%test.%'
const TestUser = [1];
module.exports = { SocketUrl, LandingUrl, TestUser, RootPath, StaticUrl, SiteUrl, UploadUrl, AppConfig, ImgConfig, ImageUrl };