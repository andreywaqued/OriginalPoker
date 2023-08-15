from tbuser import ctbUser
from tbpropaganda import ctbPropaganda

tbUser = ctbUser()
tbPropaganda = ctbPropaganda()
print(tbUser.fAuthenticate("Alexander","123456"))
print(tbUser.fGetUser("Alexander"))
print(tbUser.fGetUser(8))
print(tbPropaganda.fGetAdd(1))
print(tbPropaganda.fGetRandomAdds('video'))
print(tbPropaganda.fGetRandomAdds('image'))
print(tbPropaganda.fGetRandomAdds())
print(tbPropaganda.fGetRandomAdds())
