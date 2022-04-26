$(document).ready(function() {
    $( "#internal_sbc_ip" ).change(function() {
      var sbc_ip = $('#internal_sbc_ip').val();
      var sbc_ip_oktets = sbc_ip.split(".");
      var sbc_ip_last_oktet = sbc_ip_oktets[3];
      $( "#internal_sbc_port" ).val(5800 + Number(sbc_ip_last_oktet));
    });

    $( "#trunk_name" ).change(function() {
      $( "#group_name" ).val($( "#trunk_name" ).val().toLowerCase());
      $(this).val($(this).val().toUpperCase());
    });

    $( "#client_port" ).change(function() {
      $( "#redundant_port" ).val($( "#client_port" ).val());
    });

    $( "#outgoing_calls" ).change(function() {
      if ($('#outgoing_calls').is(':checked')) {
          $( "#sessions_outgoing_div" ).show();
      }else{
          $( "#sessions_outgoing_div" ).hide();
      }
    });

    $( "#redundancy" ).change(function() {
      if ($('#redundancy').is(':checked')) {
          $( "#redundant_div" ).show();
      }else{
          $( "#redundant_div" ).hide();
      }
    });

    // Making config button

    $( "#make_config_but" ).click(function() {
      var trunk_name = $('#trunk_name').val();
      var group_name = $('#group_name').val();

      var group_name_cn = group_name;
      var sessions_incoming = $('#sessions_incoming').val();
      var sessions_outgoing = sessions_incoming;

      if ($('#outgoing_calls').is(':checked')) {
          var group_name_cn = group_name + '_cn';
          var sessions_outgoing = $('#sessions_outgoing').val();
      }

      if ($('#redundancy').is(':checked')) {
          var redundant_ip = $('#redundant_ip').val();
          var redundant_port = $('#redundant_port').val();
      }

      var client_ip = $('#client_ip').val();
      var client_port = $('#client_port').val();

      var internal_sbc_ip = $('#internal_sbc_ip').val();
      var internal_sbc_ip_oktets = internal_sbc_ip.split(".");
      var internal_sbc_ip_last_oktet = internal_sbc_ip_oktets[3];
      var loopback_num = 2700 + Number(internal_sbc_ip_last_oktet);

      var internal_sbc_port = $('#internal_sbc_port').val();

      var client_numbers = $('#clientNumber').val().split(',');

      var acl_number = $('#acl_number').val();
      var acl_number_sip = Number(acl_number) + 1;
      var acl_number_icmp = Number(acl_number) + 2;
      var acl_number_rtp = Number(acl_number) + 3;

      if ($('#short_acl').is(':checked')) {
        var acl_number_sip_redundant = Number(acl_number) + 2;
      }else{
        var acl_number_sip_redundant = Number(acl_number) + 4;
      }

      var acl_number_icmp_redundant = Number(acl_number) + 5;
      var acl_number_rtp_redundant = Number(acl_number) + 6;


      var cac_entry = Number($('#cac_entry').val()) + 1;
      var cac_entry2 = Number($('#cac_entry').val()) + 2;

      var rtg_entry = Number($('#rtg_entry').val()) + 1;
      var rtg_entry2 = Number($('#rtg_entry').val()) + 2;

      var na_entry = Number($('#na_entry').val()) + 1;
      var na_entry2 = Number($('#na_entry').val()) + 2;

      var br = '<br>';

      $('#config_result').html('conf t<br>');

      //interface loopback config
      $('#config_result').append('&nbsp;&nbsp;&nbsp;interface Loopback' + loopback_num + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;description ' + trunk_name + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vrf forwarding SBC-Core' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ip address ' + internal_sbc_ip + ' 255.255.255.255' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no ip redirects' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no ip proxy-arp' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);

      //start sbc config
      $('#config_result').append('&nbsp;&nbsp;&nbsp;sbc 1' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;sbe' + br);

      //external adjacency
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;adjacency sip ' + trunk_name + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;description SBC-' + trunk_name + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;force-signaling-peer all' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;group ' + group_name + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vrf SBC-Internet' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nat force-on' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;header-profile outbound OUT_DOMAIN_NAME' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inherit profile preset-peering' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preferred-transport udp' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signaling-address ipv4 109.71.226.64' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;statistics method summary' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signaling-port ' + internal_sbc_port + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;remote-address ipv4 ' + client_ip + ' 255.255.255.255' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signaling-peer ' + client_ip + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signaling-peer-port ' + client_port + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;local-jitter-ratio 500' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;calc-moscqe 500' + br);

      if ($('#redundancy').is(':checked')) {
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;redundant peer 1' + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;network ipv4 ' + redundant_ip + ' 255.255.255.255' + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address ' + redundant_ip + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port ' + redundant_port + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;priority 5' + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;activate' + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      }

      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ping-enable' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;realm SBC-Internet' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;attach' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);

      //internal adjacency
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;adjacency sip ' + trunk_name + '_CN' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;description SBC-Core for ' + trunk_name + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;force-signaling-peer all' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;group ' + group_name_cn + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vrf SBC-Core' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nat force-off' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inherit profile preset-peering' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preferred-transport udp' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signaling-address ipv4 ' + internal_sbc_ip + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;statistics method summary' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signaling-port ' + internal_sbc_port + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;remote-address ipv4 10.240.16.1 255.255.255.255' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signaling-peer 10.240.16.1' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signaling-peer-port ' + internal_sbc_port + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;local-jitter-ratio 500' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ping-enable' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;realm SBC-Core' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;attach' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;exit' + br);

      //ip access list
      $('#config_result').append('&nbsp;&nbsp;&nbsp;ip access-list extended From-Internet' + br);

      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + acl_number_sip + ' permit udp host ' + client_ip + ' host 109.71.226.64 eq ' + internal_sbc_port + br);

      if (!$('#short_acl').is(':checked')) {
          $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + acl_number_icmp + ' permit icmp host ' + client_ip + ' host 109.71.226.64 ' + br);
          $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + acl_number_rtp + ' permit udp host ' + client_ip + ' host 109.71.226.64 range 16000 32000 ' + br);
      }

      if ($('#redundancy').is(':checked')) {
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + acl_number_sip_redundant + ' permit udp host ' + redundant_ip + ' host 109.71.226.64 eq ' + internal_sbc_port + br);
        if (!$('#short_acl').is(':checked')) {
            $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + acl_number_icmp_redundant + ' permit icmp host ' + redundant_ip + ' host 109.71.226.64 ' + br);
            $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + acl_number_rtp_redundant + ' permit udp host ' + redundant_ip + ' host 109.71.226.64 range 16000 32000 ' + br);
        }
      }

      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);

      //ip route
      if (!$('#no_iproute').is(':checked')) {
          $('#config_result').append('&nbsp;&nbsp;&nbsp;ip route vrf SBC-Internet ' + client_ip + ' 255.255.255.255 109.71.224.126 name SIP/RTP-' + trunk_name + br);
      }

      if ($('#redundancy').is(':checked') && !$('#no_iproute').is(':checked')) {
        $('#config_result').append('&nbsp;&nbsp;&nbsp;ip route vrf SBC-Internet ' + redundant_ip + ' 255.255.255.255 109.71.224.126 name SIP/RTP-Redundancy-' + trunk_name + br);
      }

      //start sbc config
      $('#config_result').append('&nbsp;&nbsp;&nbsp;sbc 1' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;sbe' + br);

      //call policy
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no call-policy-set 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;call-policy-set c s 1 d 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;call-policy-set 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;complete' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;call-policy-set default 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;call-policy-set 1' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no complete' + br);

      //routing table
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rtg-src-adjacency-table ADJ_SRC_ROUTING' + br);
      //entry 1
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry ' + rtg_entry + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-adjacency ' + trunk_name + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dst-adjacency ' + trunk_name + '_CN' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action complete' + br);

      if (client_numbers.length == 1 ) {
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;edit-src replace ' + client_numbers[0] + br);
      }

      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      //entry 2
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry ' + rtg_entry2 + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-adjacency ' + trunk_name + '_CN'+ br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dst-adjacency ' + trunk_name + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action complete' + br);

      if (client_numbers.length == 1 ) {
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;edit-dst replace ' + client_numbers[0] + br);
      }

      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);

      //number analyze table
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;na-src-adjacency-table ADJ_SRC_NA' + br);
      //entry 1
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry ' + na_entry + br);

      if (client_numbers.length == 1 ) {
        //entry 1
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action accept' + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-adjacency ' + trunk_name + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
        //entry 2
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry ' + na_entry2 + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action accept' + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-adjacency ' + trunk_name + '_CN' + br);

      } else {
        //entry 1
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action next-table SRC_' + trunk_name + '_NA'  + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-adjacency ' + trunk_name + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
        //entry 2
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry ' + na_entry2 + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action accept' + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-adjacency ' + trunk_name + '_CN' + br);
        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);


        $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;na-src-prefix-table SRC_' + trunk_name + '_NA' + br);
        entry_num = 1;
        $.each( client_numbers, function( i, val ) {
            $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry ' + entry_num++ + br);
            $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action accept' + br);
            $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-prefix ' + val + br);
        });
      }

      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;complete' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);

      //call-policy-set default
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;call-policy-set default 1' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no call-policy-set 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;call-policy-set c s 1 d 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;call-policy-set 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;complete' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);

      //cac-policy-set
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no cac-policy-set 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cac-policy-set c s 1 d 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cac-policy-set 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;complete' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cac-policy-set global 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cac-policy-set 1' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no complete' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cac-table SRC_ADJ_GROUP' + br);

      //entry 1
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry ' + cac_entry + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-value ' + group_name + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max-num-calls-per-scope ' + sessions_outgoing + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;codec-preference-list G711' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action cac-complete' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);

      if ($('#outgoing_calls').is(':checked')) {
          //entry 2
          $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry ' + cac_entry2 + br);
          $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match-value ' + group_name_cn + br);
          $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max-num-calls-per-scope ' + sessions_incoming + br);
          $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;codec-preference-list G711' + br);
          $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;action cac-complete' + br);
          $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      }

      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;complete' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cac-policy-set global 1' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no cac-policy-set 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cac-policy-set c s 1 d 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cac-policy-set 2' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;complete' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exit' + br);
      $('#config_result').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;end' + br);
    });
});
