<template>
  <div>
    <div>
      <h3 class="white-listing__content-header">How to whitelist</h3>
      <p>
        If you do not use a cloud-based spam filter, you can whitelist Keepnet Labs IP addresses in
        your mail server. If you use a cloud-based spam filter, you will need to whitelist by email
        header in your mail server and whitelist by IP address in your spam filter.
      </p>
      <a href="#" class="my-2">Whitelisting for Exchange 2013, 2016 and Office 365</a>
      <a href="#">Whitelisting for Google Suite</a>
    </div>
    <div>
      <h3 class="white-listing__content-header">IP Addresses and Domain</h3>
      <h5>Allow platform domain or IP address from your security devices:</h5>
      <p>secure.bestcompany.com</p>
      <p>125.0.0.12</p>
      <h5 class="mt-6">
        Allow emails from these SMTP IP addresses from your email security devices:
      </h5>
      <p>127.1.1.1</p>
      <p>127.1.1.0</p>
      <p>126.1.1.1</p>
      <h5 class="mt-6">Phishing Simulator domains:</h5>
      <p>
        Go to your
        <span style="font-style: italic; color: #1173c1;">Phishing Simulator Domains</span> on your
        dashboard to see phishing domains from your security devices
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WhiteListingContent'
}
</script>
