public class UserLogin
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UserRegister
{
    public string Email { get; set; }
    public string Password { get; set; }
    public int VerificationCode { get; set; }
    public string DateOfBirth { get; set; }
    public bool ReceiveNews { get; set; } // Thêm biến ReceiveNews
}

public class EmailRequest
{
    public string Email { get; set; } = string.Empty;
}
